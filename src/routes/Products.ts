import { ProductsController } from "../controllers/Products.controller";
import { Router }  from 'express'

export const productsRouter  = Router()
productsRouter.post('/register' , ProductsController.register)
productsRouter.get('/' , ProductsController.list)
productsRouter.post('/:id' , ProductsController.getById)
productsRouter.put('/update/:id' , ProductsController.update)