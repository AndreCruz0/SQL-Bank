import axios from "axios";
import { Op } from "sequelize";
import { Products } from "../models/Products";
import { productQuerySchema, productSchema } from "../schemas/products.schema";
import Logger from "../shared/logger";


type Transaction = {
	_id?: string;
	type: "entrada" | "saida" | string;
	qty: number;
	integrate: boolean;
	product_id: number;
	createdAt: string;
	updatedAt: string;
	__v: number;
};

export async function refreshProductData() {
	Logger.info("Iniciando atualização dos produtos não integrados.");

	try {
		

		Logger.info("Buscando dados do MongoDB...");
		const response = await axios.get<Transaction[]>(
			"http://localhost:5000/transactions/integrate?integrate=false",
		);

		Logger.debug(`Resposta da API MongoDB: ${JSON.stringify(response.data)}`);

		
			
		if (!response.data || response.data.length === 0) {
			Logger.info("Não há produtos não integrados para processar.");
			return { message: "Não há produtos não integrados" };
		}

		Logger.info("Processando transações...");
		const data = productQuerySchema.parse(response.data);

		Logger.info(`Encontradas ${data.length} transações para integrar.`);

		

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

		const updates = sqlProducts.map((product) => {
			const relatedTransactions = data.filter(
				(t) => t.product_id === product.id,
			);

			let quantityChange = 0;
			for (const transaction of relatedTransactions) {
				if (transaction.type === "entrada") quantityChange += transaction.qty;
				else if (transaction.type === "saida")
					quantityChange -= transaction.qty;
			}

			const newQty = (product.qty ?? 0) + quantityChange;

			const validatedProduct = productSchema.parse({
				...product.get(),
				qty: newQty,
			});

			Logger.info(
				`Produto ID ${product.id}: qty atual ${product.qty}, alteração ${quantityChange}, nova qty ${validatedProduct.qty}`,
			);

			return {
				...product.get(),
				qty: validatedProduct.qty,
				name: product.name ?? "",
			};
		});

		await Products.bulkCreate(updates, {
			updateOnDuplicate: ["qty"],
		});

		Logger.info("Todos os produtos foram atualizados com sucesso.");

		

		const updateResponse = await axios.put(
			"http://localhost:5000/transactions/integrate",
		);

		

		Logger.info(
			`Status da atualização no MongoDB: ${JSON.stringify(updateResponse.data)}`,
		);
		Logger.info("Integração  realizada com sucesso.");
		// essa função ira sortear se adiciona ou não itens a rota http://localhost:5000/transactions/create e se sim , ira sortear entre entrada ou saida e quantidade aleatoria de 0 a 10

	
		return {
			message: "Integração manual realizada com sucesso",
			updateInfo: updateResponse.data,
		};
	} catch (error) {
		Logger.error("Erro durante a integração:", error);
		throw error;
	}
}
