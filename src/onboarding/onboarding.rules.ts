import {
  EMAIL_TYPES,
} from './onboarding.constants';

type SubscriberState = {
  is_waitlist: boolean;

  is_newsletter: boolean;
};

export const hasReceivedOnboarding =
  (
    sentEmailTypes: string[]
  ) => {
    return (
      sentEmailTypes.includes(
        EMAIL_TYPES.WAITLIST_WELCOME
      ) ||

      sentEmailTypes.includes(
        EMAIL_TYPES.NEWSLETTER_WELCOME
      ) ||

      sentEmailTypes.includes(
        EMAIL_TYPES.COMBINED_WELCOME
      )
    );
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