import type { PrismaClient }
from '@prisma/client';

import {
  getPendingEmailJobs,
} from '../services/email-job.service';

import {
  processOnboardingJob,
} from '../onboarding/onboarding.processor';

export const runOnboardingCron =
  async (
    prisma: PrismaClient
  ) => {
    try {
      const jobs =
        await getPendingEmailJobs(
          prisma
        );

      if (
        jobs.length === 0
      ) {
        console.log(
          'No pending onboarding jobs found'
        );

        return;
      }

      console.log(
        `Processing ${jobs.length} onboarding jobs`
      );

      for (
        const job of jobs
      ) {
        await processOnboardingJob(
          prisma,
          job
        );
      }

      console.log(
        'Onboarding cron completed'
      );
    } catch (error) {
      console.error(
        'Onboarding cron failed:',
        error
      );
    }
  };