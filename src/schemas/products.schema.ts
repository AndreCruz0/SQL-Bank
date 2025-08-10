import { z } from 'zod';

export const productSchema = z.object({
  id : z.number().int().optional(),
  name: z.string().min(1),
  category_id: z.number().int().min(1),
  price: z.number().positive(),
  qty: z.number().int().nonnegative(),
});
export type Product = z.infer< typeof productSchema>

export const productParamnsSchema = z.object({
    id : z.string()
})

export const productUpdateSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  category_id: z.number().optional(),
  price: z.number().optional(),
  qty: z.number().optional(),
});

export const productQuerySchema = z.array(
  z.object({
    _id: z.string().optional(),
    type: z.string(),
    qty: z.number(),
    integrate: z.boolean(),
    product_id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    __v: z.number(),
  })
);


  