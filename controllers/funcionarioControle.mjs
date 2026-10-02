import FuncionarioModelo from '../models/funcionarioModelo.mjs'

const funcionarioControle = {

    async index(req,res){

        const funcionarios =
            await FuncionarioModelo.listar()

        res.render(
            'funcionarios/index',
            { funcionarios }
        )
    },

    async novo(req,res){

        res.render(
            'funcionarios/novo'
        )
    },

    async criar(req,res){

        await FuncionarioModelo.criar({
            nomeUsuario: req.body.nomeUsuario,
            nomeCompleto: req.body.nomeCompleto,
            email: req.body.email,
            senha: req.body.senha,
            cargo: req.body.cargo
        })

        res.redirect('/funcionarios')
    },

    async editar(req,res){

        const funcionario =
            await FuncionarioModelo.buscarPorId(
                req.params.id
            )

        res.render(
            'funcionarios/editar',
            { funcionario }
        )
    },

    async atualizar(req,res){

        await FuncionarioModelo.atualizar(
            req.params.id,
            req.body
        )

        res.redirect('/funcionarios')
    },

    async excluir(req,res){

        await FuncionarioModelo.remover(
            req.params.id
        )

        res.redirect('/funcionarios')
    }
}

export default funcionarioControle