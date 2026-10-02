function validarOculos(
    req,
    res,
    next
){

    const {
        nome,
        marca,
        preco
    } = req.body

    if(
        !nome ||
        !marca
    ){
        return res
            .status(400)
            .send(
                'Nome e marca são obrigatórios.'
            )
    }

    if(
        Number(preco) <= 0
    ){
        return res
            .status(400)
            .send(
                'Preço inválido.'
            )
    }

    next()
}

export {
    validarOculos
}