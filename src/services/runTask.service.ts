import Logger from "../shared/logger";
import { refreshProductData } from "./productIntegration.service";

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runTask() {
	Logger.info("Iniciando tarefa programada manualmente no boot.");

	const logs = [
		"Executando refreshProductData...",
		"Buscando dados e processando...",
	];

	for (const log of logs) {
		Logger.info(log);
		await delay(2000);
	}

	// Chamada da função que pode demorar
	const result = await refreshProductData();
	Logger.info(
		`Dados atualizados com sucesso: ${JSON.stringify(result, null, 2)}`,
	);

	// Delay extra antes do log final
	await delay(2000);

	Logger.info("Finalizando integração...");
	await delay(2000);

	Logger.info("Tarefa programada finalizada com sucesso.");
}
