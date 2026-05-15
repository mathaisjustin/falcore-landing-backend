import type { Context }
from 'hono';

import {
  createPrismaClient,
} from '../lib/prisma';

import {
  extractAnalyticsData,
} from '../utils/analytics';

import {
  successResponse,
  errorResponse,
} from '../utils/response';

import {
  subscriberSchema,
} from '../validators/subscriber.validator';

import {
  createOrUpdateSubscriber,
} from '../services/subscriber.service';

import type { Bindings }
from '../types/env';

export const createWaitlistSubscriber =
  async (
    c: Context<{
      Bindings: Bindings;
    }>
  ) => {
    try {
      const body =
        await c.req.json();

      const parsed =
        subscriberSchema.safeParse(
          body
        );

      if (!parsed.success) {
        return c.json(
          errorResponse(
            'Invalid request payload',
            parsed.error.flatten()
          ),
          400
        );
      }

      const analyticsData =
        extractAnalyticsData(
          c.req.raw
        );

      const prisma =
        createPrismaClient(
          c.env.DB
        );

      const subscriber =
        await createOrUpdateSubscriber(
          prisma,
          {
            email:
              parsed.data.email,

            fullName:
              parsed.data.fullName,

            consentGiven:
              parsed.data
                .consentGiven,

            source:
              parsed.data.source,

            subscriberType:
              'waitlist',

            analyticsData,
          }
        );

      return c.json(
        successResponse(
          'Successfully joined waitlist',
          subscriber
        ),
        201
      );
    } catch (error) {
      throw error;
    }
  };