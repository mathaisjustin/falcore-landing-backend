import {
  EMAIL_TYPES,
} from '../../onboarding/onboarding.constants';

import {
  buildWaitlistWelcomeTemplate,
} from './waitlist-welcome.template';

import {
  buildNewsletterWelcomeTemplate,
} from './newsletter-welcome.template';

import {
  buildCombinedWelcomeTemplate,
} from './combined-welcome.template';

export const buildEmailTemplate =
  (
    emailType: string,
    name?: string
  ) => {
    switch (emailType) {
      case EMAIL_TYPES.WAITLIST_WELCOME:
        return buildWaitlistWelcomeTemplate(
          name
        );

      case EMAIL_TYPES.NEWSLETTER_WELCOME:
        return buildNewsletterWelcomeTemplate(
          name
        );

      case EMAIL_TYPES.COMBINED_WELCOME:
        return buildCombinedWelcomeTemplate(
          name
        );

      default:
        throw new Error(
          `Unknown email type: ${emailType}`
        );
    }
  };