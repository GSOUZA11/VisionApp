import express from 'express'

import contatoControle
    from '../controllers/contatoControle.mjs'

const rota = express.Router()

rota.get(
    '/',
    contatoControle.index
)

export default rota