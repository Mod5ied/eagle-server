import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('4000'),
  JWT_SECRET: z.string().min(10, 'JWT_SECRET is required'),
  TOKEN_EXPIRY: z.string().default('1h'),
  FRONTEND_ORIGIN: z.string().min(1, 'Frontend origin is required'), // Allow comma-separated URLs
  DEMO_EMAIL: z.string().email(),
  DEMO_PASSWORD: z.string().min(8),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
  FIREBASE_PRIVATE_KEY: z.string()
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  // Fail fast silently (logger not yet initialized). Upstream will see exit.
  process.stderr.write('Invalid environment variables.\n');
  process.exit(1);
}

export const env = parsed.data;
