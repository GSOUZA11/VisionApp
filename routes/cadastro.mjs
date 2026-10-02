import express from 'express'

const rota = express.Router()

rota.get('/', (req, res) => {

    res.render('cadastro/index', {
        title: 'Cadastro',
        pagina: 'cadastro'
    })

})

rota.post('/', async (req, res) => {

    const {
        nome,
        sobrenome,
        telefone,
        email,
        senha
    } = req.body

    console.log('Novo cadastro:', {
        nome,
        sobrenome,
        telefone,
        email
    })

    return res.redirect('/autenticacao/login')

})

export default rota