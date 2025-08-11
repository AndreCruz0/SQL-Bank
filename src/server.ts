import express from 'express'
import { conn } from './db/conn'
import './models/Products'
import './models/Categories'
import { productsRouter } from './routes/Products'
import { connectionMiddleware } from './middleware/connectionMiddleware'
import { categoriesRouter } from './routes/Categories'
import cron from 'node-cron'
import Logger from './shared/logger'
import { runTask } from './services/runTask.service'
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(connectionMiddleware)
app.use(cors({
  origin: 'http://localhost:4000' 
}));
app.use('/category', categoriesRouter)
app.use('/products', productsRouter)

conn.sync()
  .then(async () => {
    app.listen(3001, async () => {
      Logger.debug("app rodando na porta 3001")

      try {
        await runTask()
      } catch (error) {
        Logger.error("Erro ao rodar a tarefa inicial:", error)
      }
    })
  })
  .catch((err) => console.log(`Erro: ${err}`))


cron.schedule('*/5 * * * *', async () => {
  Logger.info('Início da tarefa agendada: atualização dos produtos.')

  try {
    await runTask()
  } catch (error) {
    Logger.error('Erro durante a tarefa agendada:', error)
  }
})
