import DashboardModelo
from '../models/dashboardModelo.mjs'

import PedidoModelo
from '../models/pedidoModelo.mjs'

const dashboardControle = {

    async index(req, res, next) {

        try {

            const resumo =
                await DashboardModelo.resumo()

            const faturamento =
                await DashboardModelo
                    .faturamentoTotal()

            const produtos =
                await PedidoModelo
                    .produtosMaisVendidos()

            res.render(
                'dashboard/index',
                {
                    resumo,
                    faturamento,
                    produtos,
                    title: 'Dashboard',
                    pagina: 'dashboard'
                }
            )

        } catch (erro) {

            next(erro)

        }

    }

}

export default dashboardControle