export const DAILY_RESEND_LIMIT = 100;

export const DEFAULT_PROVIDER = 'resend';

export const ONBOARDING_MERGE_WINDOW_MINUTES = 10;

export const JOB_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SENT: 'sent',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export const EMAIL_EVENT_STATUS = {
  QUEUED: 'queued',
  SENT: 'sent',
  FAILED: 'failed',
} as const;

export const EMAIL_TYPES = {
  WAITLIST_WELCOME: 'waitlist_welcome',
  NEWSLETTER_WELCOME: 'newsletter_welcome',
  COMBINED_WELCOME: 'combined_welcome',
} as const;

export const JOB_TYPES = {
  ONBOARDING: 'onboarding',
} as const;