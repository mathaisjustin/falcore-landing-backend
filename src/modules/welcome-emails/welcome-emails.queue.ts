import type {
  PrismaClient,
} from '@prisma/client';

import {
  JOB_STATUS,
  ONBOARDING_MERGE_WINDOW_MINUTES,
} from './welcome-emails.constants';

export const hasPendingWelcomeEmailJob =
  async (
    prisma: PrismaClient,
    subscriberId: string
  ) => {
    return prisma.emailJob.findFirst({
      where: {
        subscriber_id:
          subscriberId,

        job_type:
          'onboarding',

        status: {
          in: [
            JOB_STATUS.PENDING,
            JOB_STATUS.PROCESSING,
          ],
        },
      },
    });
  };

export const getWelcomeEmailScheduleTime =
  () => {
    return new Date(
      Date.now() +
      ONBOARDING_MERGE_WINDOW_MINUTES *
        60 *
        1000
    );
  };