import { Sequelize } from "sequelize";

export const conn = new Sequelize('productsdb' ,'root' , '' , {
    host: "localhost" , 
    dialect : "mysql"
})


try{
    conn.authenticate()
    console.log('Conectamos com sucesso com o Sequelize!');
    
}catch(err){
    console.log(`Não foi possivel conectar: ${err}`);
    
}