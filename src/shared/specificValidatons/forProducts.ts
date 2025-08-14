import type { Response } from "express";
import { Category } from "../../models/Categories";
import { Products } from "../../models/Products";
import en from "zod/v4/locales/en.cjs";

export const productValidations = {
	async ensureCategoryExists(res: Response, categoryId: number) {
		const category = await Category.findOne({ where: { id: categoryId } });
		if (!category) {
			res
				.status(404)
				.json({ message: `Categoria com ID ${categoryId} não existe.` });
			return null;
		}
		return category;
	},

	async ensureProductNameUnique(res: Response, name: string) {
	

		const product = await Products.findOne({ where :  {name}});
		if (product) {
			res
				.status(409)
				.json({ message: `Produto com nome "${name}" já existe.` });
			return false;
		}
		return true;
	},

	async ensureProductExists(res: Response, productId: number | string) {
		const product = await Products.findOne({ where: { id: productId } });
		if (!product) {
			res
				.status(404)
				.json({ message: `Produto com ID ${productId} não existe.` });
			return null;
		}
		return product;
	},
	validateNoDuplicateIds<T extends { id: number | string }>(
		res: Response,
		data: T[],
	): boolean {
		const ids = data.map((p) => p.id); 
		const uniqueIds = new Set(ids); 
		if (uniqueIds.size !== ids.length) {
			res.status(400).json({ message: "IDs duplicados no request" }); 
			return false; 
		}
		return true; 
	},

	ensureIdProvided(res: Response, id?: string | number) {
		if (!id) {
			res.status(400).json({ message: "O ID do produto é obrigatório." });
			return false;
		}
		return true;
	},
};
