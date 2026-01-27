import express, { Request, Response } from 'express';
import postsRouter from './routes/post.route';
import notFoundHandler from './middlewares/not-found-handler';
import errorHandler from './middlewares/error-handler';
import authRouter from './routes/auth.route';
import requireAuth from './middlewares/require-auth';

const app = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/auth', authRouter)
app.use('/posts', requireAuth, postsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
