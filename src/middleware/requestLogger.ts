import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger.js';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const { method, url } = req;
  logger.info({ method, url, msg: 'incoming_request' });
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({ method, url, statusCode: res.statusCode, duration, msg: 'request_completed' });
  });
  next();
}
