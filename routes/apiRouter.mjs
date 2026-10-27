import { Router } from 'express'
import oculosApiControle from '../controllers/api/oculosApiControle.mjs'
import exigirLoginApi from '../middleware/exigirLoginApi.mjs'
import authApiControleJWT from '../controllers/api/authApiControle.mjs'
import verificarJWT from '../middleware/verificarJWT.mjs'
import ClienteModelo from '../models/clienteModelo.mjs'

const apiRouter = Router()

// Auth JWT
apiRouter.post(
    '/login',
    authApiControleJWT.login
)

// Perfil
apiRouter.get(
    '/perfil',
    verificarJWT,
    async (req, res) => {

        try {

            const cliente = await ClienteModelo.buscarPorId(
                req.usuario.id
            )

            res.json({
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email,
                telefone: cliente.telefone
            })

        } catch (erro) {

            res.status(500).json({
                mensagem: erro.message
            })

        }

    }
)

apiRouter.put(
    '/perfil',
    verificarJWT,
    async (req, res) => {

        try {

            const {
                nome,
                email,
                telefone
            } = req.body

            await ClienteModelo.atualizar(
                req.usuario.id,
                nome,
                telefone,
                email
            )

            res.json({
                mensagem: 'Perfil atualizado com sucesso'
            })

        } catch (erro) {

            res.status(500).json({
                mensagem: erro.message
            })

        }

    }
)

// Leitura
apiRouter.get('/oculos', verificarJWT, oculosApiControle.listar)
apiRouter.get('/oculos/:id', oculosApiControle.buscar)

// Escrita
apiRouter.post('/oculos', verificarJWT, exigirLoginApi, oculosApiControle.criar)
apiRouter.put('/oculos/:id', verificarJWT, exigirLoginApi, oculosApiControle.atualizar)
apiRouter.delete('/oculos/:id', verificarJWT, exigirLoginApi, oculosApiControle.remover)

export default apiRouter