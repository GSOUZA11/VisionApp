// controllers/sobreControle.mjs
const sobreControle = {

    index(req, res) {

        res.render(
            'sobre/index',
            {
                title: 'Sobre Nós',
                pagina: 'sobre'
            }
        )

    }

}

export default sobreControle