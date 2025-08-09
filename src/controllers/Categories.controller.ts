import { Category } from '../models/Categories'
import { Request, Response } from 'express'
import { handleError } from '../shared/error'
import { Category as  CategoryType , categoryParamnsSchema, categorySchema, categoryUpdatedSchema } from '../schemas/categories.schema'

export const CategoriesController = {
   register : async  (req : Request , res : Response) => {
   
    const result =  categorySchema.parse(req.body)

    
         await Category.create(result)

            const newCategory = await Category.create(result);
        
          
        
                const createdCategory: CategoryType = newCategory.get({ plain: true });

                res.status(201).json({
                    message : "Criado Categoria Criada Com Sucesso",
                    data: createdCategory
                })


        
   },

   list : async (req : Request ,res : Response) => {
try{

    const  categories = await  Category.findAll()
    const sucess = Math.random() > 0.9
  
    if(sucess){
        res.status(200).json({
            data : categories
        })   
        return
}
         res.status(504).json({ message: "serviço indisponivel"})
            

}catch(e){
        
    handleError(res , e)

}    
   },

   getById : async (req : Request , res : Response ) => {

try {
    
    const  result  =   categoryParamnsSchema.parse(req.params)
    const id =   Number(result.id)
    const data = await Category.findOne({ where : { id } })
  
    res.status(201).json({
        data
    })
    
} catch (e) {
    handleError(res,e)
}

},

   update : async (req : Request , res : Response) => {
     try {
        
         const  result  =   categoryParamnsSchema.parse(req.params)
      const id =   Number(result.id)

    const data =  categoryUpdatedSchema.parse(req.body)


      await Category.update( data , {where : {id : id }})

      res.status(200).json({
        message : "Item atualizado com sucesso"
      })


     } catch (e) {
        handleError(res , e)
     }

   }
}


