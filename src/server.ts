import express from 'express'
import { conn } from './db/conn'
import './models/Products'
import './models/Categories'
import { productsRouter } from './routes/Products'
import { connectionMiddleware } from './middleware/connectionMiddleware'
import { categoriesRouter } from './routes/Categories'
const app = express()

app.use(express.json())
app.use(connectionMiddleware)

app.use('/category' ,categoriesRouter)
app.use('/products' ,productsRouter)


conn.sync()
.then(()=>{
    app.listen(3001 , ()=> {
        console.log("app rodando na porta 3001");
        
    })
}).catch((err) => console.log(`Erro  : ${err}`)
)
