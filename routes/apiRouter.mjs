import { Router } from 'express'
import oculosApiControle from '../controllers/api/oculosApiControle.mjs'
import exigirLoginApi from '../middleware/exigirLoginApi.mjs'
import authApiControleJWT from '../controllers/api/authApiControle.mjs'
import verificarJWT from '../middleware/verificarJWT.mjs'

const apiRouter = Router()
// Auth JWTgit config --global --list
apiRouter.post(
    '/login',
    authApiControleJWT.login
)

// Perfil
apiRouter.get('/perfil', (req, res) => {
    res.json({
        nome: "Gabriel",
        email: "gabriel@email.com",
        telefone: "11999999999"
    })
})

// Leitura
apiRouter.get('/oculos',verificarJWT, oculosApiControle.listar)
apiRouter.get('/oculos/:id', oculosApiControle.buscar)

// Escrita
apiRouter.post('/oculos',verificarJWT, exigirLoginApi, oculosApiControle.criar)
apiRouter.put('/oculos/:id',verificarJWT, exigirLoginApi, oculosApiControle.atualizar)
apiRouter.delete('/oculos/:id',verificarJWT, exigirLoginApi, oculosApiControle.remover)

export default apiRouter