import FuncionarioModelo from '../models/funcionarioModelo.mjs'
import LogModelo from '../models/logModelo.mjs'

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

        const funcionario =
            await FuncionarioModelo.autenticar(
                identificador,
                senha
            )

        console.log('RESULTADO AUTENTICACAO:')
        console.log(funcionario)

        if (!funcionario) {

            return resposta.render(
                'login/index',
                {
                    erro: 'Informe usuário e senha.',
                    mostrarFooter: false
                }
            )
        }

        console.log(
            `Login realizado por ${funcionario.nomeCompleto}`
        )

        requisicao.session.usuario = {
            id: funcionario.id,
            nome: funcionario.nomeCompleto,
            cargo: funcionario.cargo
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