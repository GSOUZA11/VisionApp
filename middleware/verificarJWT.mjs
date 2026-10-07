import jwt from 'jsonwebtoken'

const JWT_SECRET =
    process.env.JWT_SECRET ||
    'meusegredowebtokensupersecretoalgumacoisa'

export function verificarJWT(
    req,
    res,
    next
) {

    const authHeader =
        req.headers.authorization

    const token =
        authHeader &&
        authHeader.split(' ')[1]

    if (!token) {

        return res
            .status(401)
            .json({
                mensagem:
                    'Token não informado.'
            })
    }

    jwt.verify(
        token,
        JWT_SECRET,
        (erro, payload) => {

            if (erro) {

                return res
                    .status(403)
                    .json({
                        mensagem:
                            'Token inválido ou expirado.'
                    })
            }

            req.usuario = payload

            next()
        }
    )
}

export default verificarJWT 