import express from 'express'
import politicaEntregaControle from '../controllers/politicaEntregaControle.mjs'

const rota = express.Router()

rota.get('/', politicaEntregaControle.index)

export default rota