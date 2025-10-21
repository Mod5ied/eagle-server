import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import { healthHandler } from '@controllers/health.controller.js';

const apiRouter: ExpressRouter = Router();
apiRouter.get('/health', healthHandler);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/products', productRoutes);

export default apiRouter;
