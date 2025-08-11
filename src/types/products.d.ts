export interface ProductAttributes {
	id?: number;
	name: string;
	category_id: number;
	price: number;
	qty: number;
}

export interface ProductUpdateAttributes {
	id: number;
	name?: string;
	category_id?: number;
	price?: number;
	qty: number;
}
