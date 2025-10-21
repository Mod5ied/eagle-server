import { env } from '@config/env.js';

export interface AuthUser { id: string; email: string; }

const DEMO_USER_ID = 'demo-user-1';

export function validateCredentials(email: string, password: string): AuthUser | null {
  if (email === env.DEMO_EMAIL && password === env.DEMO_PASSWORD) {
    return { id: DEMO_USER_ID, email };
  }
  return null;
}
