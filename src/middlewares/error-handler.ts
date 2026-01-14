import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '../lib/generated/prisma/client';

/**
 * A middleware to handle errors (global erorr handler).
 */
export default (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  // Record not found
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      return res.status(404).json({
        message: 'Resource not found',
        code: 'ERR_NOT_FOUND',
      });
    }

    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        message: 'Resource already exists',
        code: 'ERR_CONFLICT',
      });
    }
  }

  // Validation error (invalid query)
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: 'Invalid request',
      code: 'ERR_VALIDATION',
    });
  }

  // Invalid JSON
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      message: 'Invalid JSON',
      code: 'ERR_INVALID_JSON',
    });
  }

  // 500 Internal Server Error
  const response: Record<string, any> = {
    message: 'Internal Server Error',
    code: 'ERR_INTERNAL_ERROR',
  };

  // Stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = (err as Error).stack;
  }

  res.status(500).json(response);
};
