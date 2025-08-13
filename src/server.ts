import express from "express";
import { conn } from "./db/conn";
import "./models/Products";
import "./models/Categories";
import cors from "cors";
import cron from "node-cron";
import swaggerUi from "swagger-ui-express";
import { connectionMiddleware } from "./middleware/connectionMiddleware";
import { categoriesRouter } from "./routes/Categories";
import { productsRouter } from "./routes/Products";
import { runTask } from "./services/runTask.service";
import Logger from "./shared/logger";
import swaggerCombined from "./swagger-combined.json";
const app = express();

app.use(express.json());
app.use(connectionMiddleware);
app.use(
	cors({
		origin: "http://localhost:4000",
	}),
);

app.use("/category", categoriesRouter);
app.use("/products", productsRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerCombined));

conn
	.sync()
	.then(async () => {
		app.listen(3001, async () => {
			Logger.debug("app rodando na porta 3001");

			try {
				await runTask();
			} catch (error) {
				Logger.error("Erro ao rodar a tarefa inicial:", error);
			}
		});
	})
	.catch((err) => console.log(`Erro: ${err}`));

cron.schedule("*/5 * * * *", async () => {
	Logger.info("Início da tarefa agendada: atualização dos produtos.");

	try {
		await runTask();
	} catch (error) {
		Logger.error("Erro durante a tarefa agendada:", error);
	}
})


app.use((_req, res) => {
	res.status(404).json({ message: "Rota não encontrada" });
});
