import express from 'express'

import configuracaoControle
    from '../controllers/configuracaoControle.mjs'

import {
    garantirAutenticacao,
    somenteAdministrador
}
    from '../middleware/autenticacao.mjs'

const rota = express.Router()

rota.use(
    garantirAutenticacao
)

rota.use(
    somenteAdministrador
)

rota.get(
    '/',
    configuracaoControle.index
)

rota.post(
    '/',
    configuracaoControle.atualizar
)

export default rota