import configuracaoModelo
from '../models/configuracaoModelo.mjs'

const configuracaoControle = {

    async index(req,res){

        const configuracao =
            await ConfiguracaoModelo.obter()

        res.render(
            'configuracao/index',
            {
                configuracao
            }
        )
    },

    async atualizar(req,res){

        await ConfiguracaoModelo.atualizar({

            nomeLoja:
                req.body.nomeLoja,

            telefone:
                req.body.telefone,

            email:
                req.body.email,

            endereco:
                req.body.endereco
        })

        res.redirect(
            '/configuracao'
        )
    }
}

export default configuracaoControle