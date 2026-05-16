import type {
  PrismaClient,
  EmailJob,
} from '@prisma/client';

import {
  EMAIL_TYPES,
} from './onboarding.constants';

import {
  determineFinalEmailType,
  shouldSkipEmail,
} from './onboarding.rules';

export const determineOnboardingEmail =
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

    /*
      If combined already sent,
      skip everything forever
    */

    if (
      existingTypes.includes(
        EMAIL_TYPES.COMBINED_WELCOME
      )
    ) {
      return null;
    }

    /*
      Scenario 4 support

      If user originally got
      waitlist_welcome
      and later joins newsletter,
      send newsletter_welcome only

      Same logic in reverse.
    */

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

      /*
        Both already sent
      */

      if (
        hasWaitlist &&
        hasNewsletter
      ) {
        return null;
      }

      /*
        Waitlist already sent
        -> send newsletter only
      */

      if (
        hasWaitlist &&
        !hasNewsletter
      ) {
        return EMAIL_TYPES.NEWSLETTER_WELCOME;
      }

      /*
        Newsletter already sent
        -> send waitlist only
      */

      if (
        hasNewsletter &&
        !hasWaitlist
      ) {
        return EMAIL_TYPES.WAITLIST_WELCOME;
      }
    }

    /*
      Prevent duplicates
    */

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