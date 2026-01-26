import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';

/**
 * Middleware to validate request data (body, params, query) against a zod schema.
 */
export const validate =
  (schema: z.ZodType, source: 'body' | 'params' | 'query' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(422).json({
        message: 'Validation failed',
        code: 'ERR_VALIDATION',
        errors: result.error.issues,
      });
    }

    req.validated = req.validated ?? {};
    req.validated[source] = result.data;
    next();
  };
