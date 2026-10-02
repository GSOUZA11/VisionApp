import express from 'express'
import suporteControle from '../controllers/suporteControle.mjs'

const rota = express.Router()

rota.get(
    '/',
    suporteControle.index
)

export default rota