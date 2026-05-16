import { Hono } from 'hono';

import {
  createWaitlistSubscriber,
} from '../../modules/waitlist/waitlist.controller';

import type { Bindings }
from '../../types/env';

const waitlistRoute =
  new Hono<{
    Bindings: Bindings;
  }>();

waitlistRoute.post(
  '/',
  createWaitlistSubscriber
);

export default waitlistRoute;