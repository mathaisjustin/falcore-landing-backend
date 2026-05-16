import {
  EMAIL_TYPES,
} from './welcome-emails.constants';

type SubscriberState = {
  is_waitlist: boolean;

  is_newsletter: boolean;
};

export const determineFinalEmailType =
  (
    subscriber: SubscriberState
  ) => {
    if (
      subscriber.is_waitlist &&
      subscriber.is_newsletter
    ) {
      return EMAIL_TYPES.COMBINED_WELCOME;
    }

    if (
      subscriber.is_waitlist
    ) {
      return EMAIL_TYPES.WAITLIST_WELCOME;
    }

    if (
      subscriber.is_newsletter
    ) {
      return EMAIL_TYPES.NEWSLETTER_WELCOME;
    }

    return null;
  };

export const shouldSkipEmail =
  (
    existingTypes: string[],
    targetEmailType: string
  ) => {
    if (
      existingTypes.includes(
        EMAIL_TYPES.COMBINED_WELCOME
      )
    ) {
      return true;
    }

    if (
      existingTypes.includes(
        targetEmailType
      )
    ) {
      return true;
    }

    return false;
  };