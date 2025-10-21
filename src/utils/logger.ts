import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: isDev ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } } : undefined,
  redact: ['req.headers.authorization', 'req.headers.cookie']
});

export function childLogger(bindings: Record<string, unknown>) {
  return logger.child(bindings);
}
