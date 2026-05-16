import type {
  PrismaClient,
  EmailJob,
} from '@prisma/client';

import {
  determineOnboardingEmail,
} from './onboarding.engine';

import {
  lockEmailJob,
  markEmailJobFailed,
  markEmailJobSent,
} from '../services/email-job.service';

export const processOnboardingJob =
  async (
    prisma: PrismaClient,
    job: EmailJob
  ) => {
    try {
      await lockEmailJob(
        prisma,
        job.id,
        'onboarding-worker'
      );

      const emailType =
        await determineOnboardingEmail(
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

      console.log(
        `Simulating send: ${emailType} -> ${job.email}`
      );

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