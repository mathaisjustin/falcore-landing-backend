import type {
  EmailTemplate,
} from './email-template.types';

export const buildCombinedWelcomeTemplate =
  (
    name?: string
  ): EmailTemplate => {
    return {
      subject:
        'Welcome to Falcore',

      html: `
        <h1>Welcome to Falcore</h1>

        <p>
          Hey ${
            name || 'there'
          },
        </p>

        <p>
          Thanks for joining our waitlist
          and subscribing to updates.
        </p>
      `,

      text: `
        Welcome to Falcore.

        Thanks for joining our waitlist
        and newsletter.
      `,
    };
  };