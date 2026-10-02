import PedidoModelo from '../models/pedidoModelo.mjs'

const pedidoControle = {

    async index(req, res) {

        const pedidos =
            await PedidoModelo.listar()

        res.render(
            'pedido/index',
            { pedidos }
        )
    },

    async novo(req, res) {

        const clientes =
            await ClienteModelo.listar()

        const oculos =
            await OculosModelo.listar()

        res.render(
            'pedido/novo',
            {
                clientes,
                oculos
            }
        )
    },

    async criar(req, res) {

        const itens =
            JSON.parse(req.body.itens)

        await PedidoModelo.criar(
            req.body.clienteID,
            req.session.usuario.id,
            itens
        )

        res.redirect('/pedido')
    },
    
    async mostrar(req, res) {

        const pedido =
            await PedidoModelo.buscarPorId(
                req.params.id
            )

        res.render(
            'pedido/mostrar',
            { pedido }
        )
    },

    async excluir(req, res) {

        await PedidoModelo.excluir(
            req.params.id
        )

        res.redirect('/pedido')
    },

    async relatorio(req, res) {

        const dados =
            await PedidoModelo.relatorio()

        const csv =
            createObjectCsvWriter({

                path: 'relatorio.csv',

                header: [
                    {
                        id: 'id',
                        title: 'PEDIDO'
                    },
                    {
                        id: 'cliente',
                        title: 'CLIENTE'
                    },
                    {
                        id: 'total',
                        title: 'TOTAL'
                    }
                ]
            })

        await csv.writeRecords(dados)

        res.download('relatorio.csv')
    }
}

export default pedidoControle