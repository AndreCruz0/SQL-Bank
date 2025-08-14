import z from "zod";

export const categorySchema = z.object({
	name: z.string().nonempty("O nome da categoria é obrigatório"),
});
export type Category = z.infer<typeof categorySchema>;

export const categoryParamnsSchema = z.object({
	id: z.string(),
});

export const categoryUpdatedSchema = z.object({
	name: z.string().nonempty("O nome da categoria é obrigatório").optional(),
});
