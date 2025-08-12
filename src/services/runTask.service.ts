import Logger from "../shared/logger";
import { refreshProductData } from "./productIntegration.service";

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runTask() {
	Logger.info("Iniciando tarefa programada  no boot.");

	const logs = [
		"Executando refreshProductData...",
		"Buscando dados e processando...",
	];

	for (const log of logs) {
		Logger.info(log);
	}

	const result = await refreshProductData();
	Logger.info(
		`Dados atualizados com sucesso: ${JSON.stringify(result, null, 2)}`,
	);

	Logger.info("Finalizando integração...");
	
	
	Logger.info("Tarefa programada finalizada com sucesso.");
}
