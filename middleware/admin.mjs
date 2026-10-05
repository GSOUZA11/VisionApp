export function garantirAdministrador(
    req,
    res,
    next
) {

    if (
        !req.session?.usuario ||
        req.session.usuario.cargo !== 'Administrador'
    ) {
        return res.redirect('/')
    }

    next()
}