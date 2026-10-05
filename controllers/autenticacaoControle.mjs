import FuncionarioModelo from '../models/funcionarioModelo.mjs'
import LogModelo from '../models/logModelo.mjs'
import ClienteModelo from '../models/clienteModelo.mjs'

const autenticacaoControle = {

    async login(requisicao, resposta) {

        if (requisicao.session?.usuario) {
            return resposta.redirect('/')
        }

        return resposta.render(
            'login/index',
            {
                erro: null,
                mostrarFooter: false
            }
        )
    },

    async processarLogin(requisicao, resposta) {

        const { identificador, senha } = requisicao.body

        console.log('================================')
        console.log('TENTATIVA DE LOGIN')
        console.log('IDENTIFICADOR:', identificador)
        console.log('SENHA:', senha)
        console.log('================================')

        let usuario =
            await FuncionarioModelo.autenticar(
                identificador,
                senha
            )

        if (!usuario) {

            usuario =
                await ClienteModelo.autenticar(
                    identificador,
                    senha
                )
        }

        console.log('RESULTADO AUTENTICACAO:')
        console.log(usuario)

        if (!usuario) {

            return resposta.render(
                'login/index',
                {
                    erro: 'Informe usuário e senha.',
                    mostrarFooter: false
                }
            )
        }

        console.log(
            `Login realizado por ${usuario.nomeCompleto || usuario.nome}`
        )

        requisicao.session.usuario = {
            id: usuario.id,
            nome: usuario.nomeCompleto || usuario.nome,
            cargo: usuario.cargo || 'Cliente'
        }

        return requisicao.session.save(() => {
            resposta.redirect('/')
        })
    },

    async logout(requisicao, resposta) {

        if (requisicao.session?.usuario) {

            console.log(
                `Logout realizado por ${requisicao.session.usuario.nome}`
            )
        }

        return requisicao.session.destroy(() => {
            resposta.redirect('/autenticacao/login')
        })
    }

}

export default autenticacaoControle