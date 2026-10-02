import FuncionarioModelo from '../models/funcionarioModelo.mjs'
import LogModelo from '../models/logModelo.mjs'

const autenticacaoControle = {

    async login(requisicao, resposta) {

        if (requisicao.session?.usuario) {
            return resposta.redirect('/')
        }

        return resposta.render(
            'login/index', {
            erro: null,
            mostrarFooter: false
        })
    },

    async processarLogin(requisicao, resposta) {

        const { identificador, senha } = requisicao.body
        
        console.log("IDENTIFICADOR:", identificador)
        console.log("SENHA:", senha)

        const funcionario =
            await FuncionarioModelo.autenticar(
                identificador,
                senha
            )

        if (!funcionario) {

            return resposta.render(
                'login/index',
                {
                    erro: 'Informe usuário e senha.',
                    mostrarFooter: false
                }
            )
        }

        await LogModelo.registrar(
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

            await LogModelo.registrar(
                `Logout realizado por ${requisicao.session.usuario.nome}`
            )
        }

        return requisicao.session.destroy(() => {
            resposta.redirect('/autenticacao/login')
        })
    }
}

export default autenticacaoControle