function tratarErro(
    erro,
    req,
    res,
    next
) {

    console.error(erro)

    if (
        req.get('HX-Request')
    ) {

        return res
            .status(500)
            .send(
                erro.message
            )
    }

    return res
        .status(500)
        .render(
            'erro',
            {
                erro
            }
        )
}

export {
    tratarErro
}