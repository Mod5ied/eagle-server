import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@services/jwt.service.js';

const COOKIE_NAME = 'token';

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ message: 'Unauthorized' });
  (req as any).user = { id: payload.sub, email: payload.email };
  next();
}
