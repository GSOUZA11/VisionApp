
import PedidoModelo from '../models/pedidoModelo.mjs'
import ClienteModelo from '../models/clienteModelo.mjs'
import OculosModelo from '../models/oculosModelo.mjs'

const pedidoControle = {

    async index(req, res) {
        const usuario = req.session.usuario

        const pedidos = usuario.clienteID
            ? await PedidoModelo.listarPorCliente(usuario.clienteID)
            : []

        res.render('pedido/index', { pedidos })
    },

    async novo(req, res) {
        const clientes = await ClienteModelo.listar()
        const oculos = await OculosModelo.listar()

        res.render('pedido/novo', {
            clientes,
            oculos
        })
    },

    async criar(req, res) {
        const itens = JSON.parse(req.body.itens)

        await PedidoModelo.criar(
            req.body.clienteID,
            req.session.usuario.id,
            itens
        )

        res.redirect('/pedido')
    },

    async mostrar(req, res) {
        const usuario = req.session.usuario

        const pedido = await PedidoModelo.buscarPorId(
            req.params.id,
            usuario.clienteID
        )

        if (!pedido) {
            return res.status(404).send('Pedido não encontrado.')
        }

        res.render('pedido/mostrar', { pedido })
    },

    async excluir(req, res) {
        return res.status(403).send(
            'A exclusão de pedidos não está disponível para o usuário.'
        )
    },

    async relatorio(req, res) {
        return res.status(403).send(
            'Relatório não disponível para o usuário.'
        )
    }
}

export default pedidoControle
