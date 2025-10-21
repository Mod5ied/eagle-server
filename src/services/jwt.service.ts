import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { env } from '@config/env.js';

export interface JwtPayloadBase { sub: string; email: string; }

function parseExpiry(value: string): number {
  if (/^\d+$/.test(value)) return Number(value);
  // secs, mins, hrs, dayzz
  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) {
    // fall back 1h if it is invalid
    return 3600;
  }
  const amount = Number(match[1]);
  const unit = match[2];
  const multiplier: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return amount * multiplier[unit];
}

const signOptions: SignOptions = { expiresIn: parseExpiry(env.TOKEN_EXPIRY) };

export function signToken(payload: JwtPayloadBase): string {
  return jwt.sign(payload, env.JWT_SECRET, signOptions);
}

export function verifyToken(token: string): JwtPayloadBase | null {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload & JwtPayloadBase;
    // ensure req fields exist
    if (typeof decoded.sub === 'string' && typeof decoded.email === 'string') {
      return { sub: decoded.sub, email: decoded.email };
    }
    return null;
  } catch {
    return null;
  }
}
