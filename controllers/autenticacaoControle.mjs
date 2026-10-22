
import FuncionarioModelo from '../models/funcionarioModelo.mjs'
import LogModelo from '../models/logModelo.mjs'
import ClienteModelo from '../models/clienteModelo.mjs'

const autenticacaoControle = {
    async login(req, res) {
        if (req.session?.usuario) {
            return res.redirect('/')
        }

        return res.render('login/index', {
            erro: null,
            mostrarFooter: false
        })
    },

    async processarLogin(req, res) {
        try {
            const { identificador, senha } = req.body

            let usuario = await FuncionarioModelo.autenticar(
                identificador,
                senha
            )

            let tipoUsuario = 'Funcionario'

            if (!usuario) {
                usuario = await ClienteModelo.autenticar(
                    identificador,
                    senha
                )

                if (usuario) {
                    tipoUsuario = 'Cliente'
                }
            }

            if (!usuario) {
                return res.status(401).render('login/index', {
                    erro: 'Usuário ou senha inválidos.',
                    mostrarFooter: false
                })
            }

            await LogModelo.registrar(
                `Login realizado por ${usuario.nomeCompleto || usuario.nome}`
            )

            req.session.usuario = {
                id: usuario.id,
                nome: usuario.nomeCompleto || usuario.nome,
                email: usuario.email,
                cargo: tipoUsuario === 'Cliente'
                    ? 'Cliente'
                    : usuario.cargo || 'Funcionario',
                tipo: tipoUsuario,
                clienteID: tipoUsuario === 'Cliente'
                    ? usuario.id
                    : null
            }

            return req.session.save((erro) => {
                if (erro) {
                    console.error('Erro ao salvar sessão:', erro)
                    return res.status(500).send(
                        'Não foi possível iniciar a sessão.'
                    )
                }

                return res.redirect('/')
            })
        } catch (erro) {
            console.error('Erro no login:', erro)

            return res.status(500).render('login/index', {
                erro: 'Ocorreu um erro ao realizar o login.',
                mostrarFooter: false
            })
        }
    },

    async logout(req, res) {
        try {
            if (req.session?.usuario) {
                await LogModelo.registrar(
                    `Logout realizado por ${req.session.usuario.nome}`
                )
            }

            if (!req.session) {
                return res.redirect('/autenticacao/login')
            }

            return req.session.destroy((erro) => {
                if (erro) {
                    console.error('Erro ao encerrar sessão:', erro)
                    return res.status(500).send(
                        'Não foi possível encerrar a sessão.'
                    )
                }

                return res.redirect('/autenticacao/login')
            })
        } catch (erro) {
            console.error('Erro no logout:', erro)
            return res.status(500).send(
                'Ocorreu um erro ao sair da conta.'
            )
        }
    }
}

export default autenticacaoControle
