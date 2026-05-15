import { z } from 'zod';

export const subscriberSchema =
  z.object({
    email: z
      .email()
      .trim()
      .toLowerCase(),

    fullName: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .optional(),

    consentGiven:
      z.literal(true),

    source:
      z.string()
        .trim()
        .max(100)
        .optional(),
  });

export type SubscriberInput =
  z.infer<
    typeof subscriberSchema
  >;