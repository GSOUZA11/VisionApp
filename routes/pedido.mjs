import express from 'express'
import pedidoControle from '../controllers/pedidoControle.mjs'
import { garantirAutenticacao } from '../middleware/autenticacao.mjs'

const rota = express.Router()

rota.use(garantirAutenticacao)

rota.get('/', pedidoControle.index)
rota.get('/novo', pedidoControle.novo)
rota.post('/', pedidoControle.criar)
rota.get(
    '/mostrar/:id',
    pedidoControle.mostrar
)

rota.post(
    '/excluir/:id',
    pedidoControle.excluir
)

export default rota