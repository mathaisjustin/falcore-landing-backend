export type JobStatus =
  | 'pending'
  | 'processing'
  | 'sent'
  | 'failed'
  | 'cancelled';

export type EmailType =
  | 'waitlist_welcome'
  | 'newsletter_welcome'
  | 'combined_welcome';