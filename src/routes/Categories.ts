import { Router } from "express";
import { CategoriesController } from "../controllers/Categories.controller";

export const categoriesRouter = Router();
categoriesRouter.post("/create", CategoriesController.register);
categoriesRouter.get("/list", CategoriesController.list);
categoriesRouter.get("/:id", CategoriesController.getById);
categoriesRouter.put("/update/:id", CategoriesController.update);
