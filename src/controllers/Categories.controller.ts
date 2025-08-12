import type { Request, Response } from "express";
import { Category } from "../models/Categories";
import {
	categoryParamnsSchema,
	categorySchema,
	categoryUpdatedSchema,
} from "../schemas/categories.schema";
import { handleError } from "../shared/error";
import { categoriesValidations } from "../shared/specificValidatons/forCategories";

export const CategoriesController = {
	register: async (req: Request, res: Response) => {
		try {
			const result = categorySchema.parse(req.body);

			if (!(await categoriesValidations.ensureNameUnique(res, result.name)))
				return;

			const newCategory = await Category.create(result);
			res.status(201).json({
				message: "Categoria criada com sucesso",
				data: newCategory.get({ plain: true }),
			});
		} catch (e) {
			handleError(res, e);
		}
	},

	list: async (_req: Request, res: Response) => {
		try {
			const categories = await Category.findAll();
			res.status(200).json(categories);
		} catch (e) {
			handleError(res, e);
		}
	},

	getById: async (req: Request, res: Response) => {
		try {
			const { id } = categoryParamnsSchema.parse(req.params);
			if (!categoriesValidations.ensureIdProvided(res, Number(id))) return;

			const category = await categoriesValidations.ensureCategoryExists(
				res,
				Number(id),
			);
			if (!category) return;

			res.status(200).json({ data: category });
		} catch (e) {
			handleError(res, e);
		}
	},

	update: async (req: Request, res: Response) => {
		try {
			const { id } = categoryParamnsSchema.parse(req.params);
			if (!categoriesValidations.ensureIdProvided(res, Number(id))) return;

			const categoryExists = await categoriesValidations.ensureCategoryExists(
				res,
				Number(id),
			);
			if (!categoryExists) return;

			const data = categoryUpdatedSchema.parse(req.body);

			if (
				data.name &&
				!(await categoriesValidations.ensureNameUnique(
					res,
					data.name,
					Number(id),
				))
			)
				return;

			await Category.update(data, { where: { id } });
			res.status(200).json({ message: "Categoria atualizada com sucesso" });
		} catch (e) {
			handleError(res, e);
		}
	},
};
