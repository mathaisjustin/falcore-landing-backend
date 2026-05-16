import type {
  EmailTemplate,
} from './email-template.types';

export const buildWaitlistWelcomeTemplate =
  (
    name?: string
  ): EmailTemplate => {
    return {
      subject:
        'Welcome to the Falcore Waitlist',

      html: `
        <h1>Welcome to Falcore</h1>

        <p>
          Hey ${
            name || 'there'
          },
        </p>

        <p>
          Thanks for joining the waitlist.
        </p>

        <p>
          We’ll keep you updated as we build.
        </p>
      `,

      text: `
        Welcome to Falcore.

        Thanks for joining the waitlist.
      `,
    };
  };