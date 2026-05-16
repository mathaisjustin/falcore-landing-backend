import type {
  PrismaClient,
  EmailJob,
} from '@prisma/client';

import type {
  Bindings,
} from '../../types/env';

import {
  determineWelcomeEmail,
} from './welcome-emails.engine';

import {
  lockEmailJob,
  markEmailJobFailed,
  markEmailJobSent,
} from '../../services/email-job.service';

import {
  buildEmailTemplate,
} from '../../templates/emails/email-template.service';

import {
  sendEmail,
} from '../../providers/email/email.service';

export const processWelcomeEmailJob =
  async (
    prisma: PrismaClient,
    env: Bindings,
    job: EmailJob
  ) => {
    try {
      await lockEmailJob(
        prisma,
        job.id,
        'welcome-email-worker'
      );

      const emailType =
        await determineWelcomeEmail(
          prisma,
          job
        );

      if (!emailType) {
        await markEmailJobSent(
          prisma,
          job.id
        );

        return;
      }

      const subscriber =
        await prisma.subscriber.findUnique({
          where: {
            id: job.subscriber_id,
          },
        });

      if (!subscriber) {
        throw new Error(
          'Subscriber not found'
        );
      }

      const template =
        buildEmailTemplate(
          emailType,
          subscriber.full_name || undefined
        );

      const sendResult =
        await sendEmail(
          env,
          {
            to: job.email,

            subject:
              template.subject,

            html:
              template.html,

            text:
              template.text,
          }
        );

      if (!sendResult.success) {
        throw new Error(
          sendResult.error ||
            'Failed to send email'
        );
      }

      await prisma.emailEvent.create({
        data: {
          id:
            crypto.randomUUID(),

          subscriber_id:
            job.subscriber_id,

          email_job_id:
            job.id,

          email:
            job.email,

          email_type:
            emailType,

          provider:
            job.provider ||
            'resend',

          provider_message_id:
            sendResult.messageId ||
            null,

          status:
            'sent',

          sent_at:
            new Date(),
        },
      });

      await markEmailJobSent(
        prisma,
        job.id
      );
    } catch (error) {
      await markEmailJobFailed(
        prisma,
        job.id,
        error instanceof Error
          ? error.message
          : 'Unknown error'
      );
    }
  };