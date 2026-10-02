import express from 'express'
import loginControle from '../controllers/loginControle.mjs'

const rota = express.Router()

rota.get('/', loginControle.index)
rota.post('/', loginControle.autenticar)
rota.get('/logout', loginControle.logout)

export default rota