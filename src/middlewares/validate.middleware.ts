import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';

/**
 * Middleware to validate request data (body, params, query) against a zod schema.
 */
export const validate =
  (schema: z.ZodType, source: 'body' | 'params' | 'query' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req[source] = schema.parse(req[source]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation failed',
          code: 'ERR_VALIDATION',
          errors: error.issues,
        });
      }
      next(error);
    }
  };
