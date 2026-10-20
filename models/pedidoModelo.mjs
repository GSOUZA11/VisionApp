import mssql from 'mssql';
import { conectar } from '../config/db.mjs';
import MovimentacaoEstoqueModelo from './movimentacaoEstoqueModelo.mjs';

export default class PedidoModelo {

    // Lista os pedidos para a administração.
    static async listar() {
        await conectar();

        const resultado = await new mssql.Request().query(`
            SELECT
                P.*,
                C.nome AS cliente,
                F.nomeCompleto AS funcionario
            FROM dbo.Pedido P
            INNER JOIN dbo.Cliente C
                ON C.id = P.clienteID
            LEFT JOIN dbo.Funcionario F
                ON F.id = P.funcionarioID
            ORDER BY P.dataPedido DESC
        `);

        return resultado.recordset;
    }

    // Lista somente os pedidos de um cliente.
    static async listarPorCliente(clienteID) {
        await conectar();

        const idCliente = Number(clienteID);

        if (!Number.isInteger(idCliente) || idCliente <= 0) {
            return [];
        }

        const resultado = await new mssql.Request()
            .input('clienteID', mssql.Int, idCliente)
            .query(`
                SELECT
                    P.*,
                    C.nome AS cliente,
                    F.nomeCompleto AS funcionario
                FROM dbo.Pedido P
                INNER JOIN dbo.Cliente C
                    ON C.id = P.clienteID
                LEFT JOIN dbo.Funcionario F
                    ON F.id = P.funcionarioID
                WHERE P.clienteID = @clienteID
                ORDER BY P.dataPedido DESC
            `);

        return resultado.recordset;
    }

    static async criar(clienteID, funcionarioID, itens) {
        if (!Array.isArray(itens) || itens.length === 0) {
            throw new Error('O pedido deve possuir pelo menos um item.');
        }

        for (const item of itens) {
            if (!Number.isInteger(Number(item.oculosID)) ||
                Number(item.oculosID) <= 0) {
                throw new Error('Óculos inválido.');
            }

            if (!Number.isInteger(Number(item.quantidade)) ||
                Number(item.quantidade) <= 0) {
                throw new Error('Quantidade inválida.');
            }

            if (
                item.precoUnitario == null ||
                !Number.isFinite(Number(item.precoUnitario)) ||
                Number(item.precoUnitario) < 0
            ) {
                throw new Error('Preço inválido.');
            }
        }

        const idCliente = Number(clienteID);
        const idFuncionario =
            funcionarioID == null || funcionarioID === ''
                ? null
                : Number(funcionarioID);

        if (!Number.isInteger(idCliente) || idCliente <= 0) {
            throw new Error('Cliente inválido.');
        }

        if (
            idFuncionario !== null &&
            (!Number.isInteger(idFuncionario) || idFuncionario <= 0)
        ) {
            throw new Error('Funcionário inválido.');
        }

        await conectar();

        const transaction = new mssql.Transaction();
        await transaction.begin();

        try {
            const pedidoReq = new mssql.Request(transaction);

            pedidoReq.input('clienteID', mssql.Int, idCliente);
            pedidoReq.input(
                'funcionarioID',
                mssql.Int,
                idFuncionario
            );

            const pedido = await pedidoReq.query(`
                INSERT INTO dbo.Pedido
                (
                    clienteID,
                    funcionarioID,
                    dataPedido,
                    status,
                    total,
                    subtotal,
                    frete
                )
                OUTPUT INSERTED.id
                VALUES
                (
                    @clienteID,
                    @funcionarioID,
                    GETDATE(),
                    N'finalizado',
                    0,
                    0,
                    0
                )
            `);

            const pedidoID = pedido.recordset[0].id;
            let totalPedido = 0;

            for (const item of itens) {
                const oculosID = Number(item.oculosID);
                const quantidade = Number(item.quantidade);
                const precoUnitario = Number(item.precoUnitario);

                // Verifica e baixa o estoque atomicamente.
                const atualizacaoEstoque =
                    await new mssql.Request(transaction)
                        .input('id', mssql.Int, oculosID)
                        .input('quantidade', mssql.Int, quantidade)
                        .query(`
                            UPDATE dbo.Oculos
                            SET estoque = estoque - @quantidade
                            WHERE id = @id
                              AND ativo = 1
                              AND estoque >= @quantidade;

                            SELECT @@ROWCOUNT AS afetados;
                        `);

                if (atualizacaoEstoque.recordset[0].afetados !== 1) {
                    throw new Error(
                        'Estoque insuficiente ou óculos indisponível.'
                    );
                }

                await MovimentacaoEstoqueModelo.registrar(
                    oculosID,
                    'SAIDA',
                    quantidade,
                    transaction
                );

                // Mantém os pedidos administrativos em ItemPedido.
                await new mssql.Request(transaction)
                    .input('pedidoID', mssql.Int, pedidoID)
                    .input('oculosID', mssql.Int, oculosID)
                    .input('quantidade', mssql.Int, quantidade)
                    .input(
                        'precoUnitario',
                        mssql.Decimal(10, 2),
                        precoUnitario
                    )
                    .query(`
                        INSERT INTO dbo.ItemPedido
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
                    `);

                totalPedido += quantidade * precoUnitario;
            }

            await new mssql.Request(transaction)
                .input('pedidoID', mssql.Int, pedidoID)
                .input(
                    'total',
                    mssql.Decimal(10, 2),
                    totalPedido
                )
                .input(
                    'subtotal',
                    mssql.Decimal(10, 2),
                    totalPedido
                )
                .query(`
                    UPDATE dbo.Pedido
                    SET total = @total,
                        subtotal = @subtotal
                    WHERE id = @pedidoID
                `);

            await transaction.commit();

            return pedidoID;

        } catch (erro) {
            await transaction.rollback();
            throw erro;
        }
    }

    // Busca os detalhes de um pedido.
    // O segundo parâmetro, quando informado, restringe o acesso ao cliente.
    static async buscarPorId(id, clienteID = null) {
        await conectar();

        const pedidoID = Number(id);

        if (!Number.isInteger(pedidoID) || pedidoID <= 0) {
            return null;
        }

        const requisicao = new mssql.Request()
            .input('id', mssql.Int, pedidoID);

        let filtroCliente = '';

        if (clienteID !== null && clienteID !== undefined) {
            const idCliente = Number(clienteID);

            if (!Number.isInteger(idCliente) || idCliente <= 0) {
                return null;
            }

            requisicao.input('clienteID', mssql.Int, idCliente);
            filtroCliente = ' AND P.clienteID = @clienteID';
        }

        const resultadoPedido = await requisicao.query(`
            SELECT
                P.*,
                C.nome AS cliente,
                F.nomeCompleto AS funcionario
            FROM dbo.Pedido P
            INNER JOIN dbo.Cliente C
                ON C.id = P.clienteID
            LEFT JOIN dbo.Funcionario F
                ON F.id = P.funcionarioID
            WHERE P.id = @id
            ${filtroCliente}
        `);

        if (resultadoPedido.recordset.length === 0) {
            return null;
        }

        const pedido = resultadoPedido.recordset[0];

        // Primeiro consulta os itens do checkout atual.
        const resultadoCheckout = await new mssql.Request()
            .input('id', mssql.Int, pedidoID)
            .query(`
                SELECT
                    I.id,
                    I.pedido_id AS pedidoID,
                    I.oculos_id AS oculosID,
                    I.nome AS oculos,
                    I.imagem,
                    I.preco AS precoUnitario,
                    I.quantidade
                FROM dbo.pedido_itens I
                WHERE I.pedido_id = @id
                ORDER BY I.id
            `);

        pedido.itens = resultadoCheckout.recordset;

        // Se não houver itens do checkout, consulta o modelo antigo.
        if (pedido.itens.length === 0) {
            const resultadoAntigo = await new mssql.Request()
                .input('id', mssql.Int, pedidoID)
                .query(`
                    SELECT
                        I.id,
                        I.pedidoID,
                        I.oculosID,
                        O.nome AS oculos,
                        O.imagem,
                        I.precoUnitario,
                        I.quantidade
                    FROM dbo.ItemPedido I
                    INNER JOIN dbo.Oculos O
                        ON O.id = I.oculosID
                    WHERE I.pedidoID = @id
                    ORDER BY I.id
                `);

            pedido.itens = resultadoAntigo.recordset;
        }

        return pedido;
    }

    static async excluir(id) {
        await conectar();

        const pedidoID = Number(id);

        if (!Number.isInteger(pedidoID) || pedidoID <= 0) {
            throw new Error('Pedido inválido.');
        }

        const transaction = new mssql.Transaction();
        await transaction.begin();

        try {
            // Remove os itens gravados pelo checkout.
            await new mssql.Request(transaction)
                .input('id', mssql.Int, pedidoID)
                .query(`
                    DELETE FROM dbo.pedido_itens
                    WHERE pedido_id = @id
                `);

            // Remove os itens do fluxo administrativo antigo.
            await new mssql.Request(transaction)
                .input('id', mssql.Int, pedidoID)
                .query(`
                    DELETE FROM dbo.ItemPedido
                    WHERE pedidoID = @id
                `);

            // Remove os pagamentos relacionados.
            await new mssql.Request(transaction)
                .input('id', mssql.Int, pedidoID)
                .query(`
                    DELETE FROM dbo.pagamentos
                    WHERE pedido_id = @id
                `);

            await new mssql.Request(transaction)
                .input('id', mssql.Int, pedidoID)
                .query(`
                    DELETE FROM dbo.Pedido
                    WHERE id = @id
                `);

            await transaction.commit();

        } catch (erro) {
            await transaction.rollback();
            throw erro;
        }
    }

    static async contar() {
        await conectar();

        const resultado = await new mssql.Request().query(`
            SELECT COUNT(*) AS total
            FROM dbo.Pedido
        `);

        return resultado.recordset[0].total;
    }

    static async relatorio() {
        await conectar();

        const resultado = await new mssql.Request().query(`
            SELECT
                P.id,
                P.dataPedido,
                C.nome AS cliente,
                SUM(I.quantidade * I.precoUnitario) AS total
            FROM dbo.Pedido P
            INNER JOIN dbo.Cliente C
                ON C.id = P.clienteID
            INNER JOIN dbo.ItemPedido I
                ON I.pedidoID = P.id
            GROUP BY
                P.id,
                P.dataPedido,
                C.nome
            ORDER BY P.dataPedido DESC
        `);

        return resultado.recordset;
    }

    static async produtosMaisVendidos() {
        await conectar();

        const resultado = await new mssql.Request().query(`
            SELECT TOP 10
                O.nome,
                SUM(I.quantidade) AS vendidos
            FROM dbo.ItemPedido I
            INNER JOIN dbo.Oculos O
                ON O.id = I.oculosID
            GROUP BY O.nome
            ORDER BY vendidos DESC
        `);

        return resultado.recordset;
    }

    static async melhoresClientes() {
        await conectar();

        const resultado = await new mssql.Request().query(`
            SELECT TOP 10
                C.nome,
                COUNT(*) AS pedidos
            FROM dbo.Pedido P
            INNER JOIN dbo.Cliente C
                ON C.id = P.clienteID
            GROUP BY C.id, C.nome
            ORDER BY pedidos DESC
        `);

        return resultado.recordset;
    }

    static async faturamentoMensal() {
        await conectar();

        const resultado = await new mssql.Request().query(`
            SELECT
                YEAR(P.dataPedido) AS ano,
                MONTH(P.dataPedido) AS mes,
                SUM(I.quantidade * I.precoUnitario) AS total
            FROM dbo.Pedido P
            INNER JOIN dbo.ItemPedido I
                ON I.pedidoID = P.id
            GROUP BY
                YEAR(P.dataPedido),
                MONTH(P.dataPedido)
            ORDER BY
                ano DESC,
                mes DESC
        `);

        return resultado.recordset;
    }
}
