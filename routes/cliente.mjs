import express from 'express'
import clienteControle
    from '../controllers/clienteControle.mjs'

import {
    garantirAutenticacao
} from '../middleware/autenticacao.mjs'

const rota =
    express.Router()

rota.use(
    garantirAutenticacao
)

rota.get(
    '/',
    clienteControle.index
)

rota.get(
    '/novo',
    clienteControle.novo
)

rota.post(
    '/novo',
    clienteControle.criar
)

rota.get(
    '/:id/editar',
    clienteControle.editarFormulario
)

rota.post(
    '/:id/editar',
    clienteControle.atualizar
)

rota.post(
    '/:id/excluir',
    clienteControle.remover
)

export default rota