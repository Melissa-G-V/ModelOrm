import { Router } from "express"
import { DeletaID, carCreate, carDelete_Placa, carGrupos, carIndex, carPesq_Ano, carPesq_Marca, carPesq_Model, carStatus, carsEstatistica, carsPesquisa_Preco, carsUpdate } from "./controllers/carController.js"

const router = Router()

router.get('/cars', carIndex)
      .delete('/deletar/:id', DeletaID)
      .delete('/deletar/placa/:placa', carDelete_Placa)
      .get('/cars/:valor', carStatus) //perigo
      .get('/cars/agrupar/marca', carGrupos)
      .get('/estatistica', carsEstatistica)
      .get('/cars/pesquisa/marca/:pesq',carPesq_Marca)
      .get('/cars/pesquisa/modelo/:pesq', carPesq_Model)
      .get('/cars/pesquisa/preco/:preco_inicial/:preco_final?', carsPesquisa_Preco)
      .get('/cars/pesquisa/ano/:pesq',carPesq_Ano)
      .post('/cars', carCreate)
      .post('/cars/update/id/:id', carsUpdate)

      
export default router