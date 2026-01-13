import express, { Request, Response } from 'express';
import postsRouter from './routes/post.route';
import notFoundHandler from './middlewares/not-found-handler';
import errorHandler from './middlewares/error-handler';

const app = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/posts', postsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
