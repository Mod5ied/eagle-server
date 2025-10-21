import { ProductCreateInput, ProductUpdateInput } from '@schemas/product.schema.js';
import { db } from '@config/firebase.js';

const COLLECTION = 'products';

export interface ProductDoc {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  category: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export async function listProducts(): Promise<ProductDoc[]> {
  const snap = await db.collection(COLLECTION).orderBy('createdAt', 'desc').get();
  return snap.docs.map((doc: any) => toProduct(doc.id, doc.data() as Record<string, any>));
}

export async function addProduct(data: ProductCreateInput): Promise<ProductDoc> {
  await ensureUniqueSku(data.sku);
  const now = new Date();
  const ref = await db.collection(COLLECTION).add({ ...data, status: data.status ?? 'active', createdAt: now, updatedAt: now });
  const doc = await ref.get();
  return toProduct(doc.id, doc.data()!);
}

export async function updateProduct(id: string, data: ProductUpdateInput): Promise<ProductDoc | null> {
  if (data.sku) await ensureUniqueSku(data.sku, id);
  const ref = db.collection(COLLECTION).doc(id);
  const exists = await ref.get();
  if (!exists.exists) return null;
  await ref.update({ ...data, updatedAt: new Date() });
  const after = await ref.get();
  return toProduct(after.id, after.data()!);
}

export async function deleteProduct(id: string): Promise<boolean> {
  const ref = db.collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return false;
  await ref.delete();
  return true;
}

export async function updateStatus(id: string, status: 'active' | 'inactive'): Promise<ProductDoc | null> {
  const ref = db.collection(COLLECTION).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  await ref.update({ status, updatedAt: new Date() });
  const after = await ref.get();
  return toProduct(after.id, after.data()!);
}

async function ensureUniqueSku(sku: string, ignoreId?: string) {
  const snap = await db.collection(COLLECTION).where('sku', '==', sku).get();
  if (snap.empty) return;
  const conflict = snap.docs.find((doc: any) => doc.id !== ignoreId);
  if (conflict) {
    const err: any = new Error('SKU already exists');
    err.status = 409;
    throw err;
  }
}

function toProduct(id: string, data: Record<string, any>): ProductDoc {
  return {
    id,
    name: data.name,
    sku: data.sku,
    price: data.price,
    quantity: data.quantity,
    category: data.category,
    status: data.status,
    createdAt: data.createdAt instanceof Date ? data.createdAt : data.createdAt.toDate(),
    updatedAt: data.updatedAt instanceof Date ? data.updatedAt : data.updatedAt.toDate()
  };
}
