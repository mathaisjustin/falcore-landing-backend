import { Hono } from 'hono';

import {
  createNewsletterSubscriber,
} from '../controllers/newsletter.controller';

import type { Bindings }
from '../types/env';

const newsletterRoute =
  new Hono<{
    Bindings: Bindings;
  }>();

newsletterRoute.post(
  '/',
  createNewsletterSubscriber
);

export default newsletterRoute;