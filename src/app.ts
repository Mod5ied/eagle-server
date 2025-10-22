import cors from 'cors';
import express, { Express } from 'express';
import { env } from '@config/env.js';
import apiRouter from '@routes/index.js';
import cookieParser from 'cookie-parser';
import { requestLogger } from '@middleware/requestLogger.js';
import { errorHandler, notFound } from '@middleware/errorHandler.js';

const app: Express = express();
// Allow multiple origins for development and production
const allowedOrigins = env.FRONTEND_ORIGIN.split(',').map(origin => origin.trim());
app.use(cors({ 
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200 // Support legacy browsers
}));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(requestLogger);
app.use('/api', apiRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
