import express from 'express'

import sobreControle
    from '../controllers/sobreControle.mjs'

const rota = express.Router()

rota.get(
    '/',
    sobreControle.index
)

export default rota