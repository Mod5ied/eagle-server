import app from './app.js';
import { env } from '@config/env.js';
import { logger } from '@utils/logger.js';

const port = Number(env.PORT) || 4000;
app.listen(port, () => {
  logger.info({ port, msg: 'server_started' });
});
