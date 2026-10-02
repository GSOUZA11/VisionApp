import mssql from 'mssql'
import { conectar } from '../config/db.mjs'

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

        await conectar()

        const pedidoResultado = await new mssql.Request()
            .input('cliente_id', mssql.Int, cliente_id)
            .input('subtotal', mssql.Decimal(10, 2), subtotal)
            .input('frete', mssql.Decimal(10, 2), frete)
            .input('total', mssql.Decimal(10, 2), total)
            .input('status', mssql.NVarChar, 'finalizado')
            .query(`
                INSERT INTO Pedidos
                (
                    cliente_id,
                    subtotal,
                    frete,
                    total,
                    status
                )
                OUTPUT INSERTED.id
                VALUES
                (
                    @cliente_id,
                    @subtotal,
                    @frete,
                    @total,
                    @status
                )
            `)

        const pedido_id = pedidoResultado.recordset[0].id

        for (const item of produtos) {

            await new mssql.Request()
                .input('pedido_id', mssql.Int, pedido_id)
                .input('oculos_id', mssql.Int, item.oculos_id || item.id)
                .input('nome', mssql.NVarChar, item.nome)
                .input('imagem', mssql.NVarChar, item.imagem)
                .input('preco', mssql.Decimal(10, 2), item.preco)
                .input('quantidade', mssql.Int, item.quantidade)
                .query(`
                    INSERT INTO PedidoItens
                    (
                        pedido_id,
                        oculos_id,
                        nome,
                        imagem,
                        preco,
                        quantidade
                    )
                    VALUES
                    (
                        @pedido_id,
                        @oculos_id,
                        @nome,
                        @imagem,
                        @preco,
                        @quantidade
                    )
                `)

        }

        await new mssql.Request()
            .input('pedido_id', mssql.Int, pedido_id)
            .input('metodo', mssql.NVarChar, metodo)
            .input('parcelas', mssql.Int, parcelas)
            .input('valor', mssql.Decimal(10, 2), total)
            .input('status', mssql.NVarChar, 'confirmado')
            .input('codigo_referencia', mssql.NVarChar, codigo_referencia)
            .query(`
                INSERT INTO Pagamentos
                (
                    pedido_id,
                    metodo,
                    parcelas,
                    valor,
                    status,
                    codigo_referencia
                )
                VALUES
                (
                    @pedido_id,
                    @metodo,
                    @parcelas,
                    @valor,
                    @status,
                    @codigo_referencia
                )
            `)

        await new mssql.Request()
            .input('cliente_id', mssql.Int, cliente_id)
            .query(`
                DELETE FROM Carrinho
                WHERE cliente_id = @cliente_id
            `)

        return pedido_id
    }
}

export default new PagamentoModelo()