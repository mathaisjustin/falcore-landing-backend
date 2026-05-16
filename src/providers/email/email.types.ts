export type SendEmailInput = {
  to: string;

  subject: string;

  html: string;

  text?: string;
};

export type SendEmailResponse = {
  success: boolean;

  provider: string;

  messageId?: string;

  error?: string;
};