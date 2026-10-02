const suporteControle = {

    index(req, res) {

        res.render(
            'suporte/index',
            {
                title: 'Suporte Rápido',
                pagina: 'suporte'
            }
        )

    }

}

export default suporteControle