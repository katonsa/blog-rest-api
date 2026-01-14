import type { Request, Response, NextFunction } from 'express';

/**
 * A middleware to handle 404 not found routing errors.
 */
export default (_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    message: 'Not Found',
    code: 'ERR_NOT_FOUND',
  });
};
