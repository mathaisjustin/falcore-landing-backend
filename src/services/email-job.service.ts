import type { PrismaClient } from '@prisma/client';

import {
  DAILY_RESEND_LIMIT,
  DEFAULT_PROVIDER,
  JOB_STATUS,
  ONBOARDING_MERGE_WINDOW_MINUTES,
} from '../onboarding/onboarding.constants';

type CreateEmailJobInput = {
  subscriberId: string;

  email: string;

  jobType: string;

  emailType?: string;

  provider?: string;

  priority?: number;
};

export const createEmailJob = async (
  prisma: PrismaClient,
  input: CreateEmailJobInput
) => {
  const scheduledFor =
    new Date(
      Date.now() +
      ONBOARDING_MERGE_WINDOW_MINUTES *
        60 *
        1000
    );

  return prisma.emailJob.create({
    data: {
      id: crypto.randomUUID(),

      subscriber_id:
        input.subscriberId,

      email:
        input.email,

      provider:
        input.provider ||
        DEFAULT_PROVIDER,

      job_type:
        input.jobType,

      email_type:
        input.emailType,

      status:
        JOB_STATUS.PENDING,

      priority:
        input.priority || 0,

      scheduled_for:
        scheduledFor,
    },
  });
};

export const getRemainingDailyQuota =
  async (
    prisma: PrismaClient
  ) => {
    const startOfDay =
      new Date();

    startOfDay.setHours(
      0,
      0,
      0,
      0
    );

    const sentToday =
      await prisma.emailEvent.count({
        where: {
          provider: 'resend',

          status: 'sent',

          sent_at: {
            gte: startOfDay,
          },
        },
      });

    return Math.max(
      DAILY_RESEND_LIMIT -
        sentToday,
      0
    );
  };

export const getPendingEmailJobs =
  async (
    prisma: PrismaClient
  ) => {
    const remainingQuota =
      await getRemainingDailyQuota(
        prisma
      );

    if (
      remainingQuota <= 0
    ) {
      return [];
    }

    return prisma.emailJob.findMany({
      where: {
        status:
          JOB_STATUS.PENDING,

        scheduled_for: {
          lte: new Date(),
        },
      },

      orderBy: [
        {
          priority: 'asc',
        },

        {
          created_at: 'asc',
        },
      ],

      take: remainingQuota,
    });
  };

export const hasPendingOnboardingJob =
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

export const lockEmailJob =
  async (
    prisma: PrismaClient,
    jobId: string,
    workerId: string
  ) => {
    return prisma.emailJob.update({
      where: {
        id: jobId,
      },

      data: {
        status:
          JOB_STATUS.PROCESSING,

        locked_at:
          new Date(),

        locked_by:
          workerId,
      },
    });
  };

export const markEmailJobSent =
  async (
    prisma: PrismaClient,
    jobId: string
  ) => {
    return prisma.emailJob.update({
      where: {
        id: jobId,
      },

      data: {
        status:
          JOB_STATUS.SENT,

        processed_at:
          new Date(),
      },
    });
  };

export const markEmailJobFailed =
  async (
    prisma: PrismaClient,
    jobId: string,
    error: string
  ) => {
    const existingJob =
      await prisma.emailJob.findUnique(
        {
          where: {
            id: jobId,
          },
        }
      );

    if (!existingJob) {
      return null;
    }

    const attempts =
      existingJob.attempts + 1;

    const shouldFailPermanently =
      attempts >=
      existingJob.max_attempts;

    return prisma.emailJob.update({
      where: {
        id: jobId,
      },

      data: {
        attempts,

        last_error: error,

        status:
          shouldFailPermanently
            ? JOB_STATUS.FAILED
            : JOB_STATUS.PENDING,

        locked_at: null,

        locked_by: null,
      },
    });
  };