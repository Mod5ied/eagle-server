import { addProduct, deleteProduct, listProducts, updateProduct, updateStatus } from '@services/product.service.js';
import { Request, Response } from 'express';
import { logger } from '@utils/logger.js';

export async function listProductsHandler(_req: Request, res: Response) {
  const items = await listProducts();
  return res.json({ items });
}

export async function addProductHandler(req: Request, res: Response) {
  const product = await addProduct(req.body);
  logger.info({ productId: product.id, msg: 'product_created' });
  return res.status(201).json({ product });
}

export async function updateProductHandler(req: Request, res: Response) {
  const { id } = req.params;
  const product = await updateProduct(id, req.body);
  if (!product) return res.status(404).json({ message: 'Not found' });
  logger.info({ productId: product.id, msg: 'product_updated' });
  return res.json({ product });
}

export async function deleteProductHandler(req: Request, res: Response) {
  const { id } = req.params;
  const ok = await deleteProduct(id);
  if (!ok) return res.status(404).json({ message: 'Not found' });
  logger.info({ productId: id, msg: 'product_deleted' });
  return res.status(204).send();
}

export async function updateStatusHandler(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body as { status: 'active' | 'inactive' };
  const product = await updateStatus(id, status);
  if (!product) return res.status(404).json({ message: 'Not found' });
  logger.info({ productId: product.id, status: product.status, msg: 'product_status_updated' });
  return res.json({ product });
}
