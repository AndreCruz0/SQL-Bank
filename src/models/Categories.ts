import { DataTypes } from "sequelize";
import { conn } from "../db/conn";
import { Products } from "./Products";

export const Category = conn.define("categories", {
	// plural no nome da tabela
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

Category.hasMany(Products, { foreignKey: "category_id" });
Products.belongsTo(Category, { foreignKey: "category_id" });
