import type { PrismaClient } from '@prisma/client';

import type {
  CreateSubscriberInput,
} from './subscriber.types';

export const findSubscriberByEmail =
  async (
    prisma: PrismaClient,
    email: string
  ) => {
    return prisma.subscriber.findUnique({
      where: {
        email,
      },
    });
  };

export const updateSubscriber =
  async (
    prisma: PrismaClient,
    email: string,
    existingSubscriber: any,
    input: CreateSubscriberInput
  ) => {
    return prisma.subscriber.update({
      where: {
        email,
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
    });
  };

export const createSubscriber =
  async (
    prisma: PrismaClient,
    normalizedEmail: string,
    input: CreateSubscriberInput
  ) => {
    return prisma.subscriber.create({
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
          input.analyticsData.ipAddress,

        country:
          input.analyticsData.country,

        city:
          input.analyticsData.city,

        region:
          input.analyticsData.region,

        timezone:
          input.analyticsData.timezone,

        user_agent:
          input.analyticsData.userAgent,

        browser:
          input.analyticsData.browser,

        os:
          input.analyticsData.os,

        device_type:
          input.analyticsData.deviceType,

        referrer_url:
          input.analyticsData.referrerUrl,

        utm_source:
          input.analyticsData.utmSource,

        utm_medium:
          input.analyticsData.utmMedium,

        utm_campaign:
          input.analyticsData.utmCampaign,

        utm_term:
          input.analyticsData.utmTerm,

        utm_content:
          input.analyticsData.utmContent,
      },
    });
  };