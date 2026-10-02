export default function exigirLoginApi(req, res, next) {
    if (!req.session?.usuario) {
        return res.status(401).json({
            erro: 'Não autorizado'
        })
    }

    next()
}