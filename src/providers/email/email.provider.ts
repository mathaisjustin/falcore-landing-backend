import type {
  SendEmailInput,
  SendEmailResponse,
} from './email.types';

export interface EmailProvider {
  sendEmail(
    input: SendEmailInput
  ): Promise<SendEmailResponse>;
}