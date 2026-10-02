import loginModelo from '../models/loginModelo.mjs'

class LoginControle {

    index(req, res) {
        res.render('login/index', {
            titulo: 'Login',
            erro: null,
            mostrarFooter: false
        })
    }

    async autenticar(req, res) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.render('login/index', {
                    titulo: 'Login',
                    erro: 'Informe e-mail e senha.'
                })
            }

            const cliente = await loginModelo.buscarPorEmail(email)

            if (!cliente || cliente.senha !== password) {
                return res.render('login/index', {
                    titulo: 'Login',
                    erro: 'E-mail ou senha inválidos.'
                })
            }

            req.session.usuario = {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email,
                tipo: 'cliente'
            }

            res.redirect('/')

        } catch (erro) {
            console.error(erro)

            res.status(500).render('erro', {
                mensagem: 'Erro ao realizar login.'
            })
        }
    }

    logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/login')
        })
    }

}

export default new LoginControle()