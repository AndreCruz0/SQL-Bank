import { DataTypes, Model } from "sequelize";
import { conn } from "../db/conn";
import type { ProductAttributes } from "../types/products";

export class Products
	extends Model<ProductAttributes>
	implements ProductAttributes
{
	public id!: number;
	public name!: string;
	public category_id!: number;
	public price!: number;
	public qty!: number;
}

Products.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
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
	},
	{
		sequelize: conn,
		tableName: "products",
	},
);
