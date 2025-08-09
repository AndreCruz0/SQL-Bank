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

export const productUpdateSchema = z.object( {

  name: z.string().min(1).optional(),
  category_id: z.number().int().min(1).optional(),
  price: z.number().positive().optional(),
  qty: z.number().int().nonnegative().optional(),

})