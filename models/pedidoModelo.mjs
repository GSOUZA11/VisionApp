import mssql from 'mssql'
import { conectar } from '../config/db.mjs'
import MovimentacaoEstoqueModelo
    from './movimentacaoEstoqueModelo.mjs'

export default class PedidoModelo {

    static async listar() {

        await conectar()

        const resultado =
            await new mssql.Request()
                .query(`
                SELECT
                    P.*,
                    C.nome cliente
                FROM Pedido P
                INNER JOIN Cliente C
                    ON C.id=P.clienteID
            `)

        return resultado.recordset
    }

    static async criar(
        clienteID,
        funcionarioID,
        itens
    ) {
        if (
            !Array.isArray(itens) ||
            itens.length === 0
        ) {
            throw new Error(
                'O pedido deve possuir pelo menos um item.'
            )
        }

        for (const item of itens) {

            if (!item.oculosID) {
                throw new Error(
                    'Óculos inválido.'
                )
            }

            if (
                !item.quantidade ||
                item.quantidade <= 0
            ) {
                throw new Error(
                    'Quantidade inválida.'
                )
            }

            if (
                item.precoUnitario == null ||
                item.precoUnitario < 0
            ) {
                throw new Error(
                    'Preço inválido.'
                )
            }
        }

        await conectar()

        const transaction =
            new mssql.Transaction()

        await transaction.begin()

        try {

            const pedidoReq =
                new mssql.Request(
                    transaction
                )

            pedidoReq.input(
                'clienteID',
                mssql.Int,
                clienteID
            )

            pedidoReq.input(
                'funcionarioID',
                mssql.Int,
                funcionarioID
            )

            const pedido =
                await pedidoReq.query(`
                    INSERT INTO Pedido
                    (
                        clienteID,
                        funcionarioID
                    )
                    OUTPUT INSERTED.id
                    VALUES
                    (
                        @clienteID,
                        @funcionarioID
                    )
                `)

            const pedidoID =
                pedido.recordset[0].id

            for (const item of itens) {

                // Verifica estoque
                const consultaEstoque =
                    await new mssql.Request(transaction)
                        .input(
                            'id',
                            mssql.Int,
                            item.oculosID
                        )
                        .query(`
                SELECT estoque
                FROM Oculos
                WHERE id=@id
            `)

                const estoqueAtual =
                    consultaEstoque.recordset[0].estoque

                if (estoqueAtual < item.quantidade) {
                    throw new Error(
                        'Estoque insuficiente.'
                    )
                }

                // Baixa estoque
                await new mssql.Request(transaction)
                    .input(
                        'id',
                        mssql.Int,
                        item.oculosID
                    )
                    .input(
                        'quantidade',
                        mssql.Int,
                        item.quantidade
                    )
                    .query(`
            UPDATE Oculos
            SET estoque = estoque - @quantidade
            WHERE id=@id
        `)

                // Registra movimentação
                  await MovimentacaoEstoqueModelo.registrar(
                  item.oculosID,
                  'SAIDA',
                  item.quantidade,
                  transaction
                  )

                // Insere item do pedido
                await new mssql.Request(transaction)
                    .input(
                        'pedidoID',
                        mssql.Int,
                        pedidoID
                    )
                    .input(
                        'oculosID',
                        mssql.Int,
                        item.oculosID
                    )
                    .input(
                        'quantidade',
                        mssql.Int,
                        item.quantidade
                    )
                    .input(
                        'precoUnitario',
                        mssql.Decimal(10, 2),
                        item.precoUnitario
                    )
                    .query(`
            INSERT INTO ItemPedido
            (
                pedidoID,
                oculosID,
                quantidade,
                precoUnitario
            )
            VALUES
            (
                @pedidoID,
                @oculosID,
                @quantidade,
                @precoUnitario
            )
        `)
            }

            await transaction.commit()

        } catch (erro) {

            await transaction.rollback()
            throw erro
        }
    }

    static async buscarPorId(id) {

        await conectar()

        const pedido =
            await new mssql.Request()
                .input('id', mssql.Int, id)
                .query(`
            SELECT
                P.*,
                C.nome cliente,
                F.nomeCompleto funcionario
            FROM Pedido P
            INNER JOIN Cliente C
                ON C.id=P.clienteID
            INNER JOIN Funcionario F
                ON F.id=P.funcionarioID
            WHERE P.id=@id
        `)

        const itens =
            await new mssql.Request()
                .input('id', mssql.Int, id)
                .query(`
            SELECT
                I.*,
                O.nome oculos
            FROM ItemPedido I
            INNER JOIN Oculos O
                ON O.id=I.oculosID
            WHERE I.pedidoID=@id
        `)

        return {
            ...pedido.recordset[0],
            itens: itens.recordset
        }
    }

    static async excluir(id) {

        await conectar()

        const transaction =
            new mssql.Transaction()

        await transaction.begin()

        try {

            await new mssql.Request(transaction)
                .input('id', mssql.Int, id)
                .query(`
            DELETE FROM ItemPedido
            WHERE pedidoID=@id
        `)

            await new mssql.Request(transaction)
                .input('id', mssql.Int, id)
                .query(`
            DELETE FROM Pedido
            WHERE id=@id
        `)

            await transaction.commit()

        } catch (erro) {

            await transaction.rollback()

            throw erro
        }
    }

    static async contar() {

        await conectar()

        const resultado =
            await new mssql.Request()
                .query(`
            SELECT
                COUNT(*) total
            FROM Pedido
        `)

        return resultado.recordset[0].total
    }

    static async relatorio() {

        await conectar()

        const resultado =
            await new mssql.Request()
                .query(`
            SELECT

                P.id,
                P.dataPedido,

                C.nome cliente,

                SUM(
                    I.quantidade *
                    I.precoUnitario
                ) total

            FROM Pedido P

            INNER JOIN Cliente C
                ON C.id=P.clienteID

            INNER JOIN ItemPedido I
                ON I.pedidoID=P.id

            GROUP BY

                P.id,
                P.dataPedido,
                C.nome

            ORDER BY
                P.dataPedido DESC
        `)


        return resultado.recordset
    }
    static async produtosMaisVendidos() {

        await conectar()

        const resultado =
            await new mssql.Request()
                .query(`
            SELECT TOP 10

                O.nome,

                SUM(
                    I.quantidade
                ) vendidos

            FROM ItemPedido I

            INNER JOIN Oculos O
                ON O.id=I.oculosID

            GROUP BY O.nome

            ORDER BY vendidos DESC
        `)

        return resultado.recordset
    }

    static async melhoresClientes() {

        await conectar()

        const resultado =
            await new mssql.Request()
                .query(`
            SELECT TOP 10

                C.nome,

                COUNT(*) pedidos

            FROM Pedido P

            INNER JOIN Cliente C
                ON C.id=P.clienteID

            GROUP BY C.nome

            ORDER BY pedidos DESC
        `)

        return resultado.recordset
    }

    static async faturamentoMensal() {

        await conectar()

        const resultado =
            await new mssql.Request()
                .query(`
            SELECT

                YEAR(P.dataPedido) ano,

                MONTH(P.dataPedido) mes,

                SUM(
                    I.quantidade *
                    I.precoUnitario
                ) total

            FROM Pedido P

            INNER JOIN ItemPedido I
                ON I.pedidoID=P.id

            GROUP BY

                YEAR(P.dataPedido),
                MONTH(P.dataPedido)

            ORDER BY

                ano DESC,
                mes DESC
        `)

        return resultado.recordset
    }
}