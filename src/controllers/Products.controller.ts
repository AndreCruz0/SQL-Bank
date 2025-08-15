import type { Request, Response } from "express";
import z from "zod";
import { Products } from "../models/Products";
import {
	type Product,
	productParamnsSchema,
	productSchema,
	productUpdateSchema,
} from "../schemas/products.schema";
import { refreshProductData } from "../services/productIntegration.service";
import { handleError } from "../shared/error";
import { productValidations } from "../shared/specificValidatons/forProducts";
import { categoriesValidations } from "../shared/specificValidatons/forCategories";

export const ProductsController = {
	refreshData: async (_req: Request, res: Response) => {
		try {
			const result = await refreshProductData();
			res.status(200).json(result);
		} catch (e) {
			handleError(res, e);
		}
	},

	register: async (req: Request, res: Response) => {
		try {
			const result = productSchema.parse(req.body);
			
			const category = await productValidations.ensureCategoryExists(
				res,
				result.category_id,
			);
			if (!category) return;
			const isUnique = await productValidations.ensureProductNameUnique(
				res,
				result.name,
			);
			if(!isUnique) return;

			const newProduct = await Products.create(result);
			const createdProduct: Product = newProduct.get({ plain: true });

			res.status(201).json({
				message: "Produto criado com sucesso!",
				data: createdProduct,
			});
		} catch (e) {
			handleError(res, e);
		}
	},

	list: async (_req: Request, res: Response) => {
		try {
			const data = await Products.findAll();
			res.status(200).json(data);
		} catch (e) {
			handleError(res, e);
		}
	},

	refreshTransactions: async (_req: Request, res: Response) => {
		try {
			await refreshProductData();
			res.status(200).json({ message: "Transações atualizadas com sucesso!" });
		} catch (e) {
			handleError(res, e);
		}
	},

	getProductByCategoryId: async (req: Request, res: Response) => {
		try {
			const data = productParamnsSchema.parse(req.params);

			const products = await Products.findAll({
				where: { category_id: data.id },
			});
			res.status(200).json(products);
		} catch (e) {
			handleError(res, e);
		}
	},

	getByProductId: async (req: Request, res: Response) => {
		try {
			const data = productParamnsSchema.parse(req.params);
			if (!productValidations.ensureIdProvided(res, data.id)) return;

			const product = await productValidations.ensureProductExists(
				res,
				Number(data.id),
			);
			if (!product) return;

			res.status(200).json(product);
		} catch (e) {
			handleError(res, e);
		}
	},

	update: async (req: Request, res: Response) => {
		try {
			const bulkUpdateProductSchema = z.array(productUpdateSchema);
			const data = bulkUpdateProductSchema.parse(req.body);
			
			if (!productValidations.validateNoDuplicateIds(res, data)) return;
			if(!categoriesValidations.ensureExitsId(res,data.map(p=> p.category_id))) return

			await Products.bulkCreate(
				data.map((p) => ({
					id: p.id,
					name: p.name,
					category_id: p.category_id,
					price: p.price || 0,
					qty: p.qty|| 0,
				})),
				{
					updateOnDuplicate: ["name", "price", "qty", "category_id"],
				},
			);

			return res
				.status(200)
				.json({ message: "Produtos atualizados com sucesso!" });
		} catch (e) {
			handleError(res, e);
		}
	},
};
