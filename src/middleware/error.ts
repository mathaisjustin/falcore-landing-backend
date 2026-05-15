import type {
  Context,
} from 'hono';

import {
  ApiError,
} from '../utils/api-error';

import {
  errorResponse,
} from '../utils/response';

export const errorMiddleware =
  (
    error: Error,
    c: Context
  ) => {

    console.error(error);

    if (
      error instanceof ApiError
    ) {
      return c.json(
        errorResponse(
          error.message
        ),
        error.statusCode
      );
    }

    if (
      typeof error ===
        'object' &&
      error !== null &&
      'code' in error
    ) {

      return c.json(
        errorResponse(
          'Database error'
        ),
        500
      );
    }

    return c.json(
      errorResponse(
        'Internal server error'
      ),
      500
    );
  };