import type {
  EmailTemplate,
} from './email-template.types';

export const buildNewsletterWelcomeTemplate =
  (
    name?: string
  ): EmailTemplate => {
    return {
      subject:
        'Welcome to the Falcore Newsletter',

      html: `
        <h1>Welcome to Falcore</h1>

        <p>
          Hey ${
            name || 'there'
          },
        </p>

        <p>
          Thanks for subscribing to our newsletter.
        </p>
      `,

      text: `
        Welcome to Falcore.

        Thanks for subscribing.
      `,
    };
  };