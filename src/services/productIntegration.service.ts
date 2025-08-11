import axios from "axios";
import { Op } from "sequelize";
import { Products } from "../models/Products";
import { productQuerySchema, productSchema } from "../schemas/products.schema";
import Logger from "../shared/logger";

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function refreshProductData() {
	Logger.info("Iniciando atualização dos produtos não integrados.");

	try {
		await delay(1500);
		Logger.info("Buscando dados do MongoDB...");
		const response = await axios.get(
			"http://localhost:5000/products/integrate?integrate=false",
		);

		Logger.debug(
			`Resposta recebida da API MongoDB: ${JSON.stringify(response.data)}`,
		);

		await delay(1500);
		if (!response.data || response.data.length === 0) {
			Logger.info("Não há produtos não integrados para processar.");
			return { message: "Não há produtos não integrados" };
		}

		Logger.info("Processando transações...");
		const data = productQuerySchema.parse(response.data);
		Logger.info(`Foram encontrados ${data.length} transações para integrar.`);

		await delay(1500);

		// Extrai todos os product_id para buscar no SQL
		const productIds = [...new Set(data.map((item) => item.product_id))];

		const sqlProducts = await Products.findAll({
			where: { id: { [Op.in]: productIds } },
		});

		if (sqlProducts.length === 0) {
			Logger.error("Nenhum produto encontrado no banco SQL");
			throw new Error("Produtos não encontrados");
		}

		Logger.info(
			`Produtos SQL encontrados: ${sqlProducts.map((p) => p.id).join(", ")}`,
		);

		// Atualiza todos os produtos em paralelo
		await Promise.all(
			sqlProducts.map(async (product) => {
				// Pega as transações relacionadas a esse produto
				const relatedTransactions = data.filter(
					(transaction) => transaction.product_id === product.id,
				);

				// Calcula a soma das quantidades, considerando entradas e saídas
				let quantityChange = 0;
				for (const transaction of relatedTransactions) {
					if (transaction.type === "entrada") {
						quantityChange += transaction.qty;
					} else if (transaction.type === "saida") {
						quantityChange -= transaction.qty;
					}
				}

				const newQuantity = product.qty + quantityChange;

				// Valida com Zod antes de atualizar
				const validatedProduct = productSchema.parse({
					...product.get(),
					qty: newQuantity,
				});

				Logger.info(
					`Atualizando produto ID ${product.id}: quantidade atual ${product.qty}, alteração ${quantityChange}, nova quantidade ${validatedProduct.qty}`,
				);

				// Atualiza no banco SQL
				await product.update({ qty: validatedProduct.qty });
			}),
		);

		Logger.info("Todos os produtos foram atualizados com sucesso.");

		// Atualiza o status das transações no MongoDB
		await delay(1500);
		const updateResponse = await axios.put(
			"http://localhost:5000/transactions/integrate",
		);
		await delay(1500);
		Logger.info(
			`Status da atualização no MongoDB: ${JSON.stringify(updateResponse.data)}`,
		);
		Logger.info("Integração manual realizada com sucesso.");

		return {
			message: "Integração manual realizada com sucesso",
			updateInfo: updateResponse.data,
		};
	} catch (error) {
		Logger.error("Erro durante a integração:", error);
		throw error;
	}
}
