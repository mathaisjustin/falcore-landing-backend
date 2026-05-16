import type {
  Bindings,
} from '../../types/env';

import type {
  SendEmailInput,
} from './email.types';

import {
  ResendProvider,
} from './resend/resend.provider';

export const sendEmail =
  async (
    env: Bindings,
    input: SendEmailInput
  ) => {
    const provider =
      new ResendProvider(
        env
      );

    return provider.sendEmail(
      input
    );
  };