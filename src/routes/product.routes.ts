import { addProductHandler, deleteProductHandler, listProductsHandler, updateProductHandler, updateStatusHandler } from '@controllers/product.controller.js';
import { productCreateSchema, productUpdateSchema, productStatusSchema } from '@schemas/product.schema.js';
import { validateRequest } from '@middleware/validateRequest.js';
import { authGuard } from '@middleware/auth.js';
import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();
// Protect all product routes
router.use(authGuard);

router.get('/', listProductsHandler);
router.post('/', validateRequest(productCreateSchema), addProductHandler);
router.patch('/:id', validateRequest(productUpdateSchema), updateProductHandler);
router.patch('/:id/status', validateRequest(productStatusSchema), updateStatusHandler);
router.delete('/:id', deleteProductHandler);

export default router;
