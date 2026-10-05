import express from 'express'
import ClienteModelo from '../models/clienteModelo.mjs'

const rota = express.Router()

rota.get('/', (req, res) => {

    res.render('cadastro/index', {
        title: 'Cadastro',
        pagina: 'cadastro'
    })

})

rota.post('/', async (req, res) => {

    try {

        const {
            nome,
            sobrenome,
            telefone,
            email,
            senha
        } = req.body

        await ClienteModelo.criar(
            `${nome} ${sobrenome}`,
            telefone,
            email,
            senha
        )

        return res.redirect('/autenticacao/login')

    } catch (erro) {

        console.error(erro)

        return res.render(
            'cadastro/index',
            {
                erro: 'Erro ao realizar cadastro',
                title: 'Cadastro',
                pagina: 'cadastro'
            }
        )
    }

})

export default rota