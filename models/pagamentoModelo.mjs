
import mssql from "mssql";
import { conectar } from "../config/db.mjs";

class PagamentoModelo {
    async finalizar({
        cliente_id,
        produtos,
        subtotal,
        frete,
        total,
        metodo,
        parcelas,
        codigo_referencia
    }) {
        await conectar();

        if (!Array.isArray(produtos) || produtos.length === 0) {
            throw new Error("O carrinho está vazio.");
        }

        const clienteId = Number(cliente_id);

        if (!Number.isInteger(clienteId) || clienteId <= 0) {
            throw new Error("Cliente inválido para finalizar a compra.");
        }

        const transaction = new mssql.Transaction();
        let iniciada = false;

        try {
            await transaction.begin();
            iniciada = true;

            // Confirma que o cliente existe.
            const clienteRequest = new mssql.Request(transaction);

            clienteRequest.input("cliente_id", mssql.Int, clienteId);

            const cliente = await clienteRequest.query(`
                SELECT id
                FROM dbo.Cliente
                WHERE id = @cliente_id
            `);

            if (cliente.recordset.length === 0) {
                throw new Error(
                    "Cliente não encontrado. Entre novamente na sua conta."
                );
            }

            // Registra o pedido com as colunas existentes no banco.
            const pedidoRequest = new mssql.Request(transaction);

            pedidoRequest.input("clienteID", mssql.Int, clienteId);
            pedidoRequest.input(
                "subtotal",
                mssql.Decimal(10, 2),
                subtotal
            );
            pedidoRequest.input("frete", mssql.Decimal(10, 2), frete);
            pedidoRequest.input("total", mssql.Decimal(10, 2), total);

            const pedidoResultado = await pedidoRequest.query(`
                INSERT INTO dbo.Pedido (
                    clienteID,
                    funcionarioID,
                    dataPedido,
                    status,
                    total,
                    subtotal,
                    frete
                )
                OUTPUT INSERTED.id
                VALUES (
                    @clienteID,
                    NULL,
                    SYSDATETIME(),
                    N'finalizado',
                    @total,
                    @subtotal,
                    @frete
                )
            `);

            const pedidoId = pedidoResultado.recordset[0].id;

            // Registra cada óculos e atualiza o estoque.
            for (const produto of produtos) {
                const oculosId = Number(produto.oculos_id);
                const quantidade = Number(produto.quantidade);

                if (
                    !Number.isInteger(oculosId) ||
                    oculosId <= 0 ||
                    !Number.isInteger(quantidade) ||
                    quantidade <= 0
                ) {
                    throw new Error("Há um produto inválido no carrinho.");
                }

                const estoqueRequest = new mssql.Request(transaction);

                estoqueRequest.input("oculos_id", mssql.Int, oculosId);
                estoqueRequest.input(
                    "quantidade",
                    mssql.Int,
                    quantidade
                );

                const estoqueResultado = await estoqueRequest.query(`
                    UPDATE dbo.oculos
                    SET estoque = estoque - @quantidade
                    WHERE id = @oculos_id
                      AND ativo = 1
                      AND estoque >= @quantidade;

                    SELECT @@ROWCOUNT AS alterados;
                `);

                if (estoqueResultado.recordset[0].alterados !== 1) {
                    throw new Error(
                        `Estoque insuficiente ou óculos indisponível: ${produto.nome ?? oculosId}.`
                    );
                }

                const itemRequest = new mssql.Request(transaction);

                itemRequest.input("pedido_id", mssql.Int, pedidoId);
                itemRequest.input("oculos_id", mssql.Int, oculosId);
                itemRequest.input(
                    "nome",
                    mssql.NVarChar(mssql.MAX),
                    produto.nome
                );
                itemRequest.input(
                    "imagem",
                    mssql.NVarChar(mssql.MAX),
                    produto.imagem ?? null
                );
                itemRequest.input(
                    "preco",
                    mssql.Decimal(10, 2),
                    produto.preco
                );
                itemRequest.input(
                    "quantidade",
                    mssql.Int,
                    quantidade
                );

                await itemRequest.query(`
                    INSERT INTO dbo.pedido_itens (
                        pedido_id,
                        oculos_id,
                        nome,
                        imagem,
                        preco,
                        quantidade
                    )
                    VALUES (
                        @pedido_id,
                        @oculos_id,
                        @nome,
                        @imagem,
                        @preco,
                        @quantidade
                    )
                `);
            }

            // Registra o pagamento.
            const pagamentoRequest = new mssql.Request(transaction);

            pagamentoRequest.input("pedido_id", mssql.Int, pedidoId);
            pagamentoRequest.input(
                "metodo",
                mssql.NVarChar(50),
                metodo
            );
            pagamentoRequest.input(
                "parcelas",
                mssql.Int,
                parcelas
            );
            pagamentoRequest.input(
                "valor",
                mssql.Decimal(10, 2),
                total
            );
            pagamentoRequest.input(
                "codigo_referencia",
                mssql.NVarChar(255),
                codigo_referencia
            );

            await pagamentoRequest.query(`
                INSERT INTO dbo.pagamentos (
                    pedido_id,
                    metodo,
                    parcelas,
                    valor,
                    status,
                    codigo_referencia,
                    criado_em
                )
                VALUES (
                    @pedido_id,
                    @metodo,
                    @parcelas,
                    @valor,
                    N'aprovado',
                    @codigo_referencia,
                    GETDATE()
                )
            `);

            // Limpa o carrinho somente depois de registrar tudo.
            const carrinhoRequest = new mssql.Request(transaction);

            carrinhoRequest.input("cliente_id", mssql.Int, clienteId);

            await carrinhoRequest.query(`
                DELETE FROM dbo.carrinho
                WHERE cliente_id = @cliente_id
            `);

            await transaction.commit();
            iniciada = false;

            return pedidoId;
        } catch (erro) {
            if (iniciada) {
                await transaction.rollback();
            }

            throw erro;
        }
    }
}

export default new PagamentoModelo();
