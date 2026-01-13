import express, { Request, Response } from 'express';
import { Prisma } from './lib/generated/prisma/client';
import postsRouter from './routes/post.route';
const app = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/posts', postsRouter);

// Not Found handler
app.use((_req, res, _next) => {
  res.status(404).json({
    message: 'Not Found',
    code: 'ERR_NOT_FOUND',
  });
});

// Error Handler
// Express 5: async throw/reject flows into this error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
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

    // Expose stack trace only in development
    if (process.env.NODE_ENV === 'development') {
      response.stack = err.stack;
    }

    res.status(500).json(response);
  }
);

export { app };
