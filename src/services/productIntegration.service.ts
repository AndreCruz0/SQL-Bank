import axios from 'axios';
import { productQuerySchema, productSchema } from '../schemas/products.schema';
import { Products } from '../models/Products';
import Logger from '../shared/logger';
import { negative } from 'zod';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function refreshProductData() {
  Logger.info('Iniciando atualização dos produtos não integrados.');

  try {
    await delay(1500);
    Logger.info('Buscando dados do MongoDB...');
    //adicionar 10 tentativas 
    //usar logeer.warn  pra nova tentativa e erro com vermelho pra quando da errado 
    const response = await axios.get('http://localhost:5000/products/integrate?integrate=false');

    Logger.debug(`Resposta recebida da API MongoDB: ${JSON.stringify(response.data)}`);

    await delay(1500);
    if (!response.data || response.data.length === 0) {
      Logger.info('Não há produtos não integrados para processar.');
      return { message: "Não há produtos não integrados" };
    }

    Logger.info('Processando transações...');
    const data = productQuerySchema.parse(response.data);
    Logger.info(`Foram encontrados ${data.length} transações para integrar.`);

    await delay(1500);
    const resultTransactions = data.reduce((contador, item) => {
      if (item.type === 'entrada') {
        return contador + item.qty;
      }
      return contador - item.qty;
    }, 0);
    Logger.info(`Cálculo total das transações: ${resultTransactions}`);

    await delay(1500);
    const sqlDataInstance = await Products.findOne({ where: { id: data[0].product_id } });

    if (!sqlDataInstance) {
      Logger.error('Produto não encontrado no banco SQL');
      throw new Error('Produto não encontrado');
    }
    Logger.info(`Produto encontrado no banco SQL: ID ${data[0].product_id}`);

    const sqlData = sqlDataInstance.get({ plain: true });
    const validatedProduct = productSchema.parse(sqlData);

    const result = resultTransactions + validatedProduct.qty;

    Logger.info(`Quantidade atualizada: ${validatedProduct.qty} + ${resultTransactions} = ${result}`);

    await delay(1500);
    await sqlDataInstance.update({ qty: result });
    Logger.info('Quantidade do produto atualizada com sucesso no banco SQL');

    await delay(1500);
    const updateResponse = await axios.put("http://localhost:5000/transactions/integrate");
    await delay(1500);
    Logger.info(`Status da atualização no MongoDB: ${JSON.stringify(updateResponse.data)}`);
     await delay(1500);
    Logger.info('Integração manual realizada com sucesso.');
    await delay(1500);
    return { message: 'Integração manual realizada com sucesso', data: sqlDataInstance, updateInfo: updateResponse.data };
    // não vai aparecer no log 
    // faker vai adicionar dados sim ou não? 
    // vai adicionar entrada ou saida? 
    // quantidade aleatoria no mongo
    //post pra adicionar  n vai colocar put burro
  } catch (error) {
    Logger.error('Erro durante a integração:', error);
    throw error;
  }
}
