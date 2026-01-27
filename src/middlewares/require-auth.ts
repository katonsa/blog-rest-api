import type { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

export default function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorizationHeader = req.headers['authorization'];

  const suppliedToken = authorizationHeader?.split(' ')[1];

  if (!suppliedToken) {
    return res.json({
      message: 'Missing token from header.',
      code: 'ERR_UNAUTHORIZED',
    });
  }

  try {
    jwt.verify(suppliedToken, process.env.JWT_SECRET_KEY!);
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.json({
        message: 'Missing token from header.',
        code: 'ERR_UNAUTHORIZED',
      });
    } else {
      return res.json({
        message: 'Internal server error',
        code: 'ERR_INTERNAL_SERVER_ERROR',
      });
    }
  }

  next();
}
