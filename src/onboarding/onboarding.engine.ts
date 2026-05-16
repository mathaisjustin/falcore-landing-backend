import type {
  PrismaClient,
  EmailJob,
} from '@prisma/client';

import {
  determineFinalEmailType,
  hasReceivedOnboarding,
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

    const alreadySentTypes =
      existingEvents.map(
        (
          event: {
            email_type: string;
          }
        ) =>
          event.email_type
      );

    const alreadyReceivedOnboarding =
      hasReceivedOnboarding(
        alreadySentTypes
      );

    if (
      alreadyReceivedOnboarding
    ) {
      return null;
    }

    return determineFinalEmailType(
      subscriber
    );
  };