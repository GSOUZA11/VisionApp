import ClienteModelo from '../../models/clienteModelo.mjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET =
    process.env.JWT_SECRET ||
    'meusegredowebtokensupersecretoalgumacoisa'

const authApiControleJWT = {

    async login(req, res) {

        try {

            const {
                email,
                senha
            } = req.body

            if (!email || !senha) {

                return res
                    .status(400)
                    .json({
                        mensagem:
                            'E-mail e senha são obrigatórios.'
                    })
            }

            const usuario =
                await ClienteModelo.autenticar(
                    email,
                    senha
                )

            if (!usuario) {

                return res
                    .status(401)
                    .json({
                        mensagem:
                            'Credenciais inválidas.'
                    })
            }

            const token =
                jwt.sign(
                    {
                        id: usuario.id,
                        email: usuario.email,
                        nome: usuario.nome
                    },
                    JWT_SECRET,
                    {
                        expiresIn: '2h'
                    }
                )

            return res
                .status(200)
                .json({
                    mensagem:
                        'Autenticado com sucesso.',
                    token
                })

        } catch (erro) {

            console.error(erro)

            return res.status(500).json({
                mensagem: erro.message
            })
        }
    }
}

export default authApiControleJWT