function validarCliente(
    req,
    res,
    next
){

    if(
        !req.body.nome
    ){
        return res
            .status(400)
            .send(
                'Nome obrigatório.'
            )
    }

    next()
}

export {
    validarCliente
}