import type { PrismaClient }
from '@prisma/client';

import {
  createEmailJob,
  hasPendingOnboardingJob,
} from './email-job.service';

import {
  EMAIL_TYPES,
  JOB_TYPES,
} from '../onboarding/onboarding.constants';

type SubscriberType =
  'waitlist' |
  'newsletter';

type CreateSubscriberInput =
  {
    email: string;

    fullName?: string;

    consentGiven: boolean;

    source?: string;

    subscriberType:
      SubscriberType;

    analyticsData: {
      ipAddress:
        string | null;

      country:
        string | null;

      city:
        string | null;

      region:
        string | null;

      timezone:
        string | null;

      userAgent: string;

      browser:
        string | null;

      os:
        string | null;

      deviceType:
        string | null;

      referrerUrl:
        string | null;

      utmSource:
        string | null;

      utmMedium:
        string | null;

      utmCampaign:
        string | null;

      utmTerm:
        string | null;

      utmContent:
        string | null;
    };
  };

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
      await prisma.subscriber.findUnique(
        {
          where: {
            email:
              normalizedEmail,
          },
        }
      );

    if (
      existingSubscriber
    ) {
      const updatedSubscriber =
        await prisma.subscriber.update(
          {
            where: {
              email:
                normalizedEmail,
            },

            data: {
              full_name:
                input.fullName ||
                existingSubscriber.full_name,

              source:
                input.source ||
                existingSubscriber.source,

              is_waitlist:
                input.subscriberType ===
                'waitlist'
                  ? true
                  : existingSubscriber.is_waitlist,

              is_newsletter:
                input.subscriberType ===
                'newsletter'
                  ? true
                  : existingSubscriber.is_newsletter,

              waitlist_joined_at:
                input.subscriberType ===
                  'waitlist' &&
                !existingSubscriber.is_waitlist
                  ? new Date()
                  : existingSubscriber.waitlist_joined_at,

              newsletter_joined_at:
                input.subscriberType ===
                  'newsletter' &&
                !existingSubscriber.is_newsletter
                  ? new Date()
                  : existingSubscriber.newsletter_joined_at,

              updated_at:
                new Date(),
            },
          }
        );

    const existingJob =
      await hasPendingOnboardingJob(
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
      await prisma.subscriber.create(
        {
          data: {
            id:
              crypto.randomUUID(),

            email:
              normalizedEmail,

            full_name:
              input.fullName,

            source:
              input.source,

            is_waitlist:
              input.subscriberType ===
              'waitlist',

            is_newsletter:
              input.subscriberType ===
              'newsletter',

            waitlist_joined_at:
              input.subscriberType ===
              'waitlist'
                ? new Date()
                : null,

            newsletter_joined_at:
              input.subscriberType ===
              'newsletter'
                ? new Date()
                : null,

            consent_given:
              input.consentGiven,

            ip_address:
              input
                .analyticsData
                .ipAddress,

            country:
              input
                .analyticsData
                .country,

            city:
              input
                .analyticsData
                .city,

            region:
              input
                .analyticsData
                .region,

            timezone:
              input
                .analyticsData
                .timezone,

            user_agent:
              input
                .analyticsData
                .userAgent,

            browser:
              input
                .analyticsData
                .browser,

            os:
              input
                .analyticsData.os,

            device_type:
              input
                .analyticsData
                .deviceType,

            referrer_url:
              input
                .analyticsData
                .referrerUrl,

            utm_source:
              input
                .analyticsData
                .utmSource,

            utm_medium:
              input
                .analyticsData
                .utmMedium,

            utm_campaign:
              input
                .analyticsData
                .utmCampaign,

            utm_term:
              input
                .analyticsData
                .utmTerm,

            utm_content:
              input
                .analyticsData
                .utmContent,
          },
        }
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