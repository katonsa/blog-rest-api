import { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';

export const validate =
  (schema: z.ZodType, source: 'body' | 'params' | 'query' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req[source] = schema.parse(req[source]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(422).json({
          message: 'Validation failed',
          code: 'ERR_VALIDATION',
          errors: error.issues,
        });
      }
      next(error);
    }
  };
