import express from 'express'
import funcionarioControle from '../controllers/funcionarioControle.mjs'
import { garantirAutenticacao } from '../middleware/autenticacao.mjs'

const rota = express.Router()

rota.use(garantirAutenticacao)

rota.get('/',funcionarioControle.index)

rota.get('/novo',funcionarioControle.novo)

rota.post('/',funcionarioControle.criar)

rota.get(
    '/editar/:id',
    funcionarioControle.editar
)

rota.post(
    '/:id',
    funcionarioControle.atualizar
)

rota.post(
    '/excluir/:id',
    funcionarioControle.excluir
)

export default rota