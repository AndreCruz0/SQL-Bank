export type Transaction = {
  _id?: string;
  type: "entrada" | "saida" | string;
  qty: number;
  integrate: boolean;
  product_id: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
