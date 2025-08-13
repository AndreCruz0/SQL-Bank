import express from "express";
import path from "path";
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
import scalarApiReference, { apiReference } from "@scalar/express-api-reference";

const app = express();

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:4000";

app.use(express.json());
app.use(connectionMiddleware);
app.use(cors({ origin: FRONTEND_URL }));

// Serve arquivo swagger estático
app.use('/swagger-combined.json', express.static(path.join(__dirname, 'swagger-combined.json')));

app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);

app.use('/docs', apiReference({
  spec: {
    url: '/swagger-combined.json',
  },
  theme: 'purple',
}));

conn.sync()
  .then(async () => {
    try {
      await runTask();
      app.listen(PORT, () => {
        Logger.debug(`App rodando na porta ${PORT}`);
      });
    } catch (error) {
      Logger.error("Erro ao rodar a tarefa inicial:", error);
      process.exit(1);
    }
  })
  .catch((err) => {
    Logger.error(`Erro na conexão com o banco: ${err}`);
  });

cron.schedule("*/5 * * * *", async () => {
  Logger.info("Início da tarefa agendada: atualização dos produtos.");

  try {
    await runTask();
  } catch (error) {
    Logger.error("Erro durante a tarefa agendada:", error);
  }
});

app.use((_req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

