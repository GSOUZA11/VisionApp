// controllers/homeControle.mjs

const homeControle = {

    index(req, res) {

        res.render(
            'home/index',
            {
                title: 'Vision',
                pagina: 'home'
            }
        )

    }

}

export default homeControle