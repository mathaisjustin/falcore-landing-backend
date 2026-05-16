import type {
  Bindings,
} from '../../../types/env';

import type {
  EmailProvider,
} from '../email.provider';

import type {
  SendEmailInput,
  SendEmailResponse,
} from '../email.types';

import {
  createResendClient,
} from './resend.client';

export class ResendProvider
  implements EmailProvider
{
  constructor(
    private env: Bindings
  ) {}

  async sendEmail(
    input: SendEmailInput
  ): Promise<SendEmailResponse> {
    try {
      console.log(
        'Using Resend API Key:',
        this.env.RESEND_API_KEY
          ? 'EXISTS'
          : 'MISSING'
      );

      console.log(
        'Using From Email:',
        this.env
          .RESEND_FROM_EMAIL
      );

      console.log(
        'Sending email to:',
        input.to
      );

      const resend =
        createResendClient(
          this.env
            .RESEND_API_KEY
        );

      console.log(
        'Sending email via Resend...'
      );

      const response =
        await resend.emails.send({
          from:
            this.env
              .RESEND_FROM_EMAIL,

          to:
            input.to,

          subject:
            input.subject,

          html:
            input.html,

          text:
            input.text,
        });

      console.log(
        'Full Resend response:',
        JSON.stringify(
          response
        )
      );

      console.log(
        'Response data:',
        JSON.stringify(
          response.data
        )
      );

      console.log(
        'Response error:',
        JSON.stringify(
          response.error
        )
      );

      return {
        success:
          !response.error,

        provider:
          'resend',

        messageId:
          response.data?.id,

        error:
          response.error
            ? JSON.stringify(
                response.error
              )
            : undefined,
      };
    } catch (error) {
      console.error(
        'Resend send failed:',
        error
      );

      return {
        success: false,

        provider:
          'resend',

        error:
          error instanceof Error
            ? error.message
            : 'Unknown resend error',
      };
    }
  }
}