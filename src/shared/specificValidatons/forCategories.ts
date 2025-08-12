import type { Response } from "express";
import { Category } from "../../models/Categories";

export const categoriesValidations = {
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

	ensureIdProvided(res: Response, id?: number) {
		if (!id) {
			res.status(400).json({ message: "O ID da categoria é obrigatório." });
			return false;
		}
		return true;
	},

	async ensureNameUnique(res: Response, name: string, excludeId?: number) {
		const where = excludeId ? { name, id: { not: excludeId } } : { name };

		const category = await Category.findOne({ where });
		if (category) {
			res
				.status(409)
				.json({ message: `Categoria com nome "${name}" já existe.` });
			return false;
		}
		return true;
	},
};
