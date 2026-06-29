import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  imageUrl: z.string().optional(),
  flavor: z.string().optional(),
  size: z.string().optional(),
  occasion: z.string().optional(),
  available: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createOrderSchema = z.object({
  productId: z.string().min(1),
  customerName: z.string().min(1),
  customerPhone: z.string().min(8),
  size: z.string().min(1),
  deliveryDate: z.string().datetime(),
  notes: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY', 'DELIVERED', 'CANCELLED']),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
