import type {
  PrismaClient,
  EmailJob,
} from '@prisma/client';

import {
  EMAIL_TYPES,
} from './welcome-emails.constants';

import {
  determineFinalEmailType,
  shouldSkipEmail,
} from './welcome-emails.rules';

export const determineWelcomeEmail =
  async (
    prisma: PrismaClient,
    job: EmailJob
  ) => {
    const subscriber =
      await prisma.subscriber.findUnique({
        where: {
          id: job.subscriber_id,
        },
      });

    if (!subscriber) {
      return null;
    }

    const existingEvents =
      await prisma.emailEvent.findMany({
        where: {
          subscriber_id:
            subscriber.id,

          status: 'sent',
        },
      });

    const existingTypes =
      existingEvents.map(
        (
          event: {
            email_type: string;
          }
        ) =>
          event.email_type
      );

    const finalEmailType =
      determineFinalEmailType(
        subscriber
      );

    if (!finalEmailType) {
      return null;
    }

    if (
      existingTypes.includes(
        EMAIL_TYPES.COMBINED_WELCOME
      )
    ) {
      return null;
    }

    if (
      finalEmailType ===
      EMAIL_TYPES.COMBINED_WELCOME
    ) {
      const hasWaitlist =
        existingTypes.includes(
          EMAIL_TYPES.WAITLIST_WELCOME
        );

      const hasNewsletter =
        existingTypes.includes(
          EMAIL_TYPES.NEWSLETTER_WELCOME
        );

      if (
        hasWaitlist &&
        hasNewsletter
      ) {
        return null;
      }

      if (
        hasWaitlist &&
        !hasNewsletter
      ) {
        return EMAIL_TYPES.NEWSLETTER_WELCOME;
      }

      if (
        hasNewsletter &&
        !hasWaitlist
      ) {
        return EMAIL_TYPES.WAITLIST_WELCOME;
      }
    }

    if (
      shouldSkipEmail(
        existingTypes,
        finalEmailType
      )
    ) {
      return null;
    }

    return finalEmailType;
  };