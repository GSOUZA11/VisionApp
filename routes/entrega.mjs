import express from 'express'
import entregaControle from '../controllers/entregaControle.mjs'

const rota = express.Router()

rota.get('/', entregaControle.index)

rota.post('/', entregaControle.salvar)

export default rota