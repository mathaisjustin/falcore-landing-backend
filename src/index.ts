import { Hono } from 'hono';

import {
  runOnboardingCron,
} from './cron/onboarding.cron';

import type { Bindings }
from './types/env';

import waitlistRoute
from './routes/waitlist';

import newsletterRoute
from './routes/newsletter';

import {
  createPrismaClient,
} from './lib/prisma';

import {
  corsMiddleware,
} from './middleware/cors';

import {
  loggerMiddleware,
} from './middleware/logger';

import {
  requestIdMiddleware,
} from './middleware/request-id';

import {
  securityMiddleware,
} from './middleware/security';

import {
  rateLimitMiddleware,
} from './middleware/rate-limit';

import {
  errorMiddleware,
} from './middleware/error';

const app =
  new Hono<{
    Bindings: Bindings;
  }>();

app.use(
  '*',
  corsMiddleware
);

app.use(
  '*',
  loggerMiddleware
);

app.use(
  '*',
  requestIdMiddleware
);

app.use(
  '/api/*',
  rateLimitMiddleware
);

app.use(
  '*',
  securityMiddleware
);

app.onError(
  errorMiddleware
);

app.get('/', async (c) => {
  const prisma =
    createPrismaClient(
      c.env.DB
    );

  const subscriberCount =
    await prisma.subscriber.count();

  return c.json({
    success: true,
    message:
      'Falcore Landing API Running',

    subscriberCount,
  });
});

app.route(
  '/api/waitlist',
  waitlistRoute
);

app.route(
  '/api/newsletter',
  newsletterRoute
);

export default {
  fetch: app.fetch,

  scheduled: async (
    event: ScheduledEvent,
    env: Bindings,
    ctx: ExecutionContext
  ) => {
    console.log(
      'Running onboarding cron...'
    );

    const prisma =
      createPrismaClient(
        env.DB
      );

    ctx.waitUntil(
      runOnboardingCron(
        prisma,
        env
      )
    );
  },
};