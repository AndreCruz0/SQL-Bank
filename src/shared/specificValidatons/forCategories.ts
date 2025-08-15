import type { Response } from "express";
import { Op } from "sequelize";
import { Category } from "../../models/Categories";
interface idtype {
	id: number | string;
}
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
		const where = excludeId
			? { name, id: { [Op.ne]: excludeId } }
			: { name };

		const category = await Category.findOne({ where });
		if (category) {
			res
				.status(409)
				.json({ message: `Categoria com nome "${name}" já existe.` });
			return false;
		}
		return true;
	},

	async ensureExitsId(res: Response, categoryIds: Array<number | string>) {
    const uniqueCategoryIds = Array.from(
        new Set(categoryIds.map(id => Number(id)))
    );


    const existingCategories = await Category.findAll({
        where: { id: uniqueCategoryIds },
        attributes: ['id'],
    });

    const foundIdsSet = new Set(existingCategories.map(c => Number(c.dataValues.id)));

    const missingIds = uniqueCategoryIds.filter(id => !foundIdsSet.has(id));

    if (missingIds.length > 0) {
        res.status(404).json({
            message: `Categorias com IDs ${missingIds.join(", ")} não existem.`,
        });
        return null;
    }

    return existingCategories;
}
};
