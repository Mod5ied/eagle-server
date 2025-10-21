import { Request, Response } from 'express';
import { validateCredentials } from '@services/auth.service.js';
import { signToken, verifyToken } from '@services/jwt.service.js';
import { logger } from '@utils/logger.js';

const COOKIE_NAME = 'token';

export async function loginHandler(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };
  const user = validateCredentials(email, password);
  if (!user) {
    logger.warn({ email, msg: 'invalid_credentials' });
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = signToken({ sub: user.id, email: user.email });
  res.cookie(COOKIE_NAME, token, cookieOptions());
  logger.info({ userId: user.id, msg: 'login_success' });
  return res.status(200).json({ user: { id: user.id, email: user.email } });
}

export async function meHandler(req: Request, res: Response) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ message: 'Unauthorized' });
  return res.status(200).json({ user: { id: payload.sub, email: payload.email } });
}

export async function logoutHandler(_req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  return res.status(200).json({ success: true });
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 1000 * 60 * 60 // 1h
  };
}
