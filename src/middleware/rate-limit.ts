import type {
  Context,
  Next,
} from 'hono';

type RateLimitEntry = {
  count: number;

  expiresAt: number;
};

const rateLimitStore =
  new Map<
    string,
    RateLimitEntry
  >();

const WINDOW_MS =
  60 * 1000;

const MAX_REQUESTS = 10;

export const rateLimitMiddleware =
  async (
    c: Context,
    next: Next
  ) => {
    const ip =
      c.req.header(
        'CF-Connecting-IP'
      ) ||
      c.req.header(
        'x-forwarded-for'
      ) ||
      'unknown';

    const now = Date.now();

    const existing =
      rateLimitStore.get(ip);

    if (
      existing &&
      existing.expiresAt > now
    ) {
      if (
        existing.count >=
        MAX_REQUESTS
      ) {
        return c.json(
          {
            success: false,

            message:
              'Too many requests',
          },
          429
        );
      }

      existing.count += 1;

      rateLimitStore.set(
        ip,
        existing
      );
    } else {
      rateLimitStore.set(ip, {
        count: 1,

        expiresAt:
          now + WINDOW_MS,
      });
    }

    await next();
  };