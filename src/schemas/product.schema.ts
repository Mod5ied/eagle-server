import { z } from 'zod';

export const productBase = {
  name: z.string().min(2),
  sku: z.string().min(2),
  price: z.number().positive(),
  quantity: z.number().int().nonnegative(),
  category: z.string().min(2),
  status: z.enum(['active', 'inactive']).default('active')
};

export const productCreateSchema = z.object(productBase).omit({ status: true }).extend({ status: productBase.status.optional() });
export const productUpdateSchema = z.object(productBase).partial();
export const productStatusSchema = z.object({ status: productBase.status });

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
