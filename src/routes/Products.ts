import { ProductsController } from "../controllers/Products.controller";
import { Router }  from 'express'

export const productsRouter  = Router()
productsRouter.post('/register' , ProductsController.register)
productsRouter.get('/' , ProductsController.list)
productsRouter.get('/:id' , ProductsController.getByProductId)
productsRouter.get('/category/:id' , ProductsController.getProductByCategoryId)
productsRouter.put('/update' , ProductsController.update)
productsRouter.get('/refresh' , ProductsController.refreshData)