import axios from "axios";
import type { Request, Response } from "express";
import { log } from "winston";
import z from "zod";
import { Products } from "../models/Products";
import {
	type Product,
	productParamnsSchema,
	productQuerySchema,
	productSchema,
	productUpdateSchema,
} from "../schemas/products.schema";
import { refreshProductData } from "../services/productIntegration.service";
import { handleError } from "../shared/error";

export const ProductsController = {
	home: (req: Request, res: Response) => {
		res.json("caiu aq");
	},

	refreshData: async (req: Request, res: Response) => {
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

	list: async (req: Request, res: Response) => {
		const data = await Products.findAll();

		res.status(200).json(data);
	},

	getProductByCategoryId: async (req: Request, res: Response) => {
		const data = productParamnsSchema.parse(req.params);
		const products = await Products.findAll({
			where: { category_id: data.id },
		});

		res.status(200).json(products);
	},
	getByProductId: async (req: Request, res: Response) => {
		const data = productParamnsSchema.parse(req.params);
		const products = await Products.findAll({ where: { id: data.id } });

		res.status(200).json(products);
	},
	update: async (req: Request, res: Response) => {
		const bulkUpdateProductSchema = z.array(productUpdateSchema);

		Products.create;

		try {
			const data = bulkUpdateProductSchema.parse(req.body);

			await Promise.all(
				data.map(async (product) => {
					const { id, ...data } = product;

					return await Products.update(data, { where: { id: id } });
				}),
			);
			return res
				.status(200)
				.json({ message: "Produtos atualizados com sucesso!" });
		} catch (e) {
			handleError(res, e);
		}

		res.status(200).json({
			message: "O produto foi atualizado com sucesso",
		});
	},
};
