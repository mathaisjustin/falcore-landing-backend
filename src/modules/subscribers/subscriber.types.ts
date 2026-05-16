export type SubscriberType =
  | 'waitlist'
  | 'newsletter';

export type CreateSubscriberInput = {
  email: string;

  fullName?: string;

  consentGiven: boolean;

  source?: string;

  subscriberType: SubscriberType;

  analyticsData: {
    ipAddress: string | null;

    country: string | null;

    city: string | null;

    region: string | null;

    timezone: string | null;

    userAgent: string;

    browser: string | null;

    os: string | null;

    deviceType: string | null;

    referrerUrl: string | null;

    utmSource: string | null;

    utmMedium: string | null;

    utmCampaign: string | null;

    utmTerm: string | null;

    utmContent: string | null;
  };
};