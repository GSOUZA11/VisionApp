import { Router } from 'express'
import oculosApiControle from '../controllers/api/oculosApiControle.mjs'
import exigirLoginApi from '../middleware/exigirLoginApi.mjs'

const apiRouter = Router()

// Leitura: pública
apiRouter.get('/oculos', oculosApiControle.listar)
apiRouter.get('/oculos/:id', oculosApiControle.buscar)

// Escrita: exige login (sessão)
apiRouter.post('/oculos', exigirLoginApi, oculosApiControle.criar)
apiRouter.put('/oculos/:id', exigirLoginApi, oculosApiControle.atualizar)
apiRouter.delete('/oculos/:id', exigirLoginApi, oculosApiControle.remover)

export default apiRouter
