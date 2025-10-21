import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger.js';

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: 'Not Found' });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  logger.error({ err: { message: err.message, stack: err.stack }, status, msg: 'unhandled_error' });
  res.status(status).json({ message: err.message || 'Internal Server Error' });
}
