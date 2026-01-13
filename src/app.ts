import express, { Request, Response } from 'express';
const app = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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
    res
      .status(500)
      .json({ message: 'Internal Server Error', code: 'ERR_INTERNAL_ERROR' });
  }
);

// Not Found handler
app.use((_req, res, _next) => {
  res.status(404).json({
    message: 'Not Found',
    code: 'ERR_NOT_FOUND',
  });
});

export { app };
