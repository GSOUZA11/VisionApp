const contatoControle = {

    index(req, res) {

        res.render(
            'contato/index',
            {
                title: 'Contato',
                pagina: 'contato'
            }
        )

    }

}

export default contatoControle