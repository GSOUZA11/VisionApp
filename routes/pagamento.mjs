import express from 'express'
import pagamentoControle from '../controllers/pagamentoControle.mjs'

const rota = express.Router()

rota.get(
    '/',
    pagamentoControle.index
)

rota.post(
    '/',
    pagamentoControle.finalizar
)

export default rota