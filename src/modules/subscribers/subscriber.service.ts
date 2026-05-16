import type { PrismaClient }
from '@prisma/client';

import {
  createEmailJob,
} from '../emails/email.queue';

import {
  hasPendingWelcomeEmailJob,
  getWelcomeEmailScheduleTime,
} from '../welcome-emails/welcome-emails.queue';

import {
  EMAIL_TYPES,
  JOB_TYPES,
} from '../welcome-emails/welcome-emails.constants';

import type {
  CreateSubscriberInput,
} from './subscriber.types';

import {
  findSubscriberByEmail,
  updateSubscriber,
  createSubscriber,
} from './subscriber.repository';

export const createOrUpdateSubscriber =
  async (
    prisma: PrismaClient,
    input: CreateSubscriberInput
  ) => {
    const normalizedEmail =
      input.email
        .trim()
        .toLowerCase();

    const existingSubscriber =
      await findSubscriberByEmail(
        prisma,
        normalizedEmail
      );

    if (existingSubscriber) {
      const updatedSubscriber =
        await updateSubscriber(
          prisma,
          normalizedEmail,
          existingSubscriber,
          input
        );

      const existingJob =
        await hasPendingWelcomeEmailJob(
          prisma,
          updatedSubscriber.id
        );

      if (!existingJob) {
        await createEmailJob(
          prisma,
          {
            subscriberId:
              updatedSubscriber.id,

            email:
              updatedSubscriber.email,

            jobType:
              JOB_TYPES.ONBOARDING,

            emailType:
              input.subscriberType ===
              'waitlist'
                ? EMAIL_TYPES.WAITLIST_WELCOME
                : EMAIL_TYPES.NEWSLETTER_WELCOME,
          }
        );
      }

      return updatedSubscriber;
    }

    const newSubscriber =
      await createSubscriber(
        prisma,
        normalizedEmail,
        input
      );

    await createEmailJob(
      prisma,
      {
        subscriberId:
          newSubscriber.id,

        email:
          newSubscriber.email,

        jobType:
          JOB_TYPES.ONBOARDING,

        emailType:
          input.subscriberType ===
          'waitlist'
            ? EMAIL_TYPES.WAITLIST_WELCOME
            : EMAIL_TYPES.NEWSLETTER_WELCOME,
      }
    );

    return newSubscriber;
  };