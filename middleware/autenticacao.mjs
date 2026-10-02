//Bloquear rotas privadas para usuários sem sessão ativa.
function garantirAutenticacao(requisicao, resposta, proximo) {
    if (requisicao.session?.usuario) {
        return proximo()
    }

    if (requisicao.get('HX-Request')) {
        resposta.set('HX-Redirect', '/autenticacao/login')
        return resposta.status(401).end()
    }

    return resposta.redirect('/autenticacao/login')

}

function somenteAdministrador(
    req,
    res,
    next
) {

    if (
        !req.session?.usuario
    ) {
        return res.redirect(
            '/autenticacao/login'
        )
    }

    if (
        req.session.usuario.cargo !==
        'Administrador'
    ) {
        return res.status(403)
            .send(
                'Acesso negado.'
            )
    }

    next()
}


export { garantirAutenticacao, somenteAdministrador }