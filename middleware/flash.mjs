function flash(req,res,next){

    res.locals.sucesso =
        req.session.sucesso || null

    res.locals.erro =
        req.session.erro || null

    delete req.session.sucesso
    delete req.session.erro

    next()
}

export {
    flash
}