import express from 'express'

import dashboardControle
    from '../controllers/dashboardControle.mjs'

import {
    garantirAutenticacao
}
    from '../middleware/autenticacao.mjs'

const rota = express.Router()

rota.use(
    garantirAutenticacao
)

rota.get(
    '/',
    dashboardControle.index
)

export default rota