import ClienteModelo
    from '../models/clienteModelo.mjs'

const clienteControle = {

    async index(req, res) {

        const clientes =
            await ClienteModelo.listar()

        return res.render(
            'clientes/index',
            { clientes }
        )
    },

    async novo(req, res) {

        return res.render(
            'clientes/novo'
        )
    },

    async criar(req, res) {

        if (!req.body.nome) {

            return res.status(400)
                .send('Nome obrigatório')
        }

        try {

            await ClienteModelo.criar({

                nome: req.body.nome,
                telefone: req.body.telefone,
                email: req.body.email

            })

            return res.redirect(
                '/clientes'
            )

        } catch (erro) {

            console.error(erro)

            return res.status(500)
                .send(
                    'Erro ao cadastrar cliente'
                )
        }
    },

    async editarFormulario(
        req,
        res
    ) {

        const cliente =
            await ClienteModelo
                .buscarPorId(
                    req.params.id
                )

        if (!cliente) {

            return res.status(404)
                .send(
                    'Cliente não encontrado'
                )
        }

        return res.render(
            'clientes/editar',
            { cliente }
        )
    },

    async atualizar(
        req,
        res
    ) {

        try {

            await ClienteModelo.atualizar(
                req.params.id,
                {
                    nome:
                        req.body.nome,

                    telefone:
                        req.body.telefone,

                    email:
                        req.body.email
                }
            )

            return res.redirect(
                '/clientes'
            )

        } catch (erro) {

            console.error(erro)

            return res.status(500)
                .send(
                    'Erro ao atualizar cliente'
                )
        }
    },

    async remover(
        req,
        res
    ) {

        try {

            await ClienteModelo.remover(
                req.params.id
            )

            return res.redirect(
                '/clientes'
            )

        } catch (erro) {

            console.error(erro)

            return res.status(500)
                .send(
                    'Erro ao remover cliente'
                )
        }
    }
}

export default clienteControle