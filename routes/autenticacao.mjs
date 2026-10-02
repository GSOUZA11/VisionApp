import express from 'express'
import autenticacaoControle
from '../controllers/autenticacaoControle.mjs'

const rota = express.Router()

rota.get('/login', autenticacaoControle.login)

rota.post(
    '/login',
    autenticacaoControle.processarLogin
)

rota.get(
    '/logout',
    autenticacaoControle.logout
)

export default rota