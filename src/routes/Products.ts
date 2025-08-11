import { Router } from "express";
import { ProductsController } from "../controllers/Products.controller";

export const productsRouter = Router();
productsRouter.post("/register", ProductsController.register);
productsRouter.get("/list", ProductsController.list);
productsRouter.get("/refreshTransactions", ProductsController.refreshTransactions);
productsRouter.put("/bulk-update", ProductsController.update);
productsRouter.get("/refresh", ProductsController.refreshData);
productsRouter.get("/category/:id", ProductsController.getProductByCategoryId);
productsRouter.get("/:id", ProductsController.getByProductId);
