import type {
  Context,
  Next,
} from 'hono';

export const securityMiddleware =
  async (
    c: Context,
    next: Next
  ) => {
    c.header(
      'X-Content-Type-Options',
      'nosniff'
    );

    c.header(
      'X-Frame-Options',
      'DENY'
    );

    c.header(
      'Referrer-Policy',
      'strict-origin-when-cross-origin'
    );

    await next();
  };