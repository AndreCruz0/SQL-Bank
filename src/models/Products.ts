import { DataTypes } from "sequelize";
import { conn } from "../db/conn";
export const Products = conn.define("products", {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	category_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	price: {
		type: DataTypes.FLOAT,
		allowNull: false,
	},
	qty: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});
