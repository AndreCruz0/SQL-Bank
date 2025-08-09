import { Products } from '../models/Products'
import { Request, Response } from 'express'
import { handleError } from '../shared/error'
import { Product, productParamnsSchema, productQuerySchema, productSchema, productUpdateSchema } from '../schemas/products.schema'
import axios from 'axios'
import { log } from 'winston'

export const ProductsController = {
    home : (req : Request , res : Response) => {

        res.json("caiu aq")
    },

    refreshData: async (req: Request, res: Response) => {
  
      try {
    
        const response = await axios.get('http://localhost:5000/products?integrate=false');


    const data =  productQuerySchema.parse(response.data);

    // Atualiza o SQL aqui

    res.status(200).json({ message: 'Integração manual realizada com sucesso', data });
  } catch (e) {
    handleError(res, e);
  }
},

    register: async (req: Request, res: Response) => {
    try {
        
        
      const result = productSchema.parse(req.body)
        
        
    const newProduct = await Products.create(result);

  

        const createdProduct: Product = newProduct.get({ plain: true });

        res.status(201).json({
      message: `Produto criado com sucesso!`,
      data: createdProduct,  
    });

      

    
    } catch (e) {
        handleError(res ,e)
    }
  },

   list:  async (req: Request, res: Response) => {

    const data =  await Products.findAll()

    res.status(200).json({
        data
    })

  },

  getById: async (req: Request, res: Response) => {
    res.json({
      message: "caiu em getById",
    })
  },
  update : async (req : Request , res : Response) => {

    const data =  productUpdateSchema.parse(req.body)

    const params = productParamnsSchema.parse(req.params)

    await Products.update(data , {where : {id :  Number(params.id) }})

    res.status(200).json({
        message : "O produto foi atualizado com sucesso"
    })
  }
  

}


