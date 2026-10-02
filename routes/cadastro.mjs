import express from 'express'

const rota = express.Router()

rota.get(
    '/',
    (req, res) => {

        res.render(
            'cadastro/index',
            {
                title: 'Cadastro',
                pagina: 'cadastro'
            }
        )

    }
)

export default rota