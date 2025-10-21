import cors from 'cors';
import express, { Express } from 'express';
import { env } from '@config/env.js';
import apiRouter from '@routes/index.js';
import cookieParser from 'cookie-parser';
import { requestLogger } from '@middleware/requestLogger.js';
import { errorHandler, notFound } from '@middleware/errorHandler.js';

const app: Express = express();
app.use(cors({ origin: env.FRONTEND_ORIGIN, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(requestLogger);
app.use('/api', apiRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
