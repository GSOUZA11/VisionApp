import mssql from 'mssql'
import { conectar } from '../config/db.mjs'

export default class DashboardModelo {

    static async resumo(){

        await conectar()

        const resultado =
            await new mssql.Request()
            .query(`

                SELECT

                    (
                        SELECT COUNT(*)
                        FROM Cliente
                    ) totalClientes,

                    (
                        SELECT COUNT(*)
                        FROM Funcionario
                    ) totalFuncionarios,

                    (
                        SELECT COUNT(*)
                        FROM Pedido
                    ) totalPedidos,

                    (
                        SELECT COUNT(*)
                        FROM Oculos
                        WHERE ativo=1
                    ) totalOculos

            `)

        return resultado.recordset[0]
    }

    static async faturamentoTotal(){

        await conectar()

        const resultado =
            await new mssql.Request()
            .query(`

                SELECT

                    ISNULL(
                        SUM(
                            quantidade *
                            precoUnitario
                        ),
                        0
                    ) total

                FROM ItemPedido

            `)

        return resultado.recordset[0].total
    }
}