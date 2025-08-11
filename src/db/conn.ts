import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import Logger from "../shared/logger";

// Carrega o arquivo certo: .env.development ou .env.production
dotenv.config({
	path: `.env.${process.env.NODE_ENV || "development"}`,
});

export const conn = new Sequelize(
	process.env.DB_NAME || "productsdb",
	process.env.DB_USER || "root",
	process.env.DB_PASS || "",
	{
		host: process.env.DB_HOST || "localhost",
		dialect: "mysql",
		logging: process.env.NODE_ENV === "development" ? console.log : false,
	},
);

try {
	conn.authenticate();
	Logger.debug("Conexão com o banco de daos estabelecida com sucesso");
} catch (err) {
	Logger.error(`Não foi possível conectar: ${err}`);
}
