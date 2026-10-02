import mssql from "mssql";

class CompraModelo {

    async criar(dados) {

        const request = new mssql.Request();

        request.input("id_cliente", mssql.Int, dados.id_cliente);
        request.input("valor_total", mssql.Decimal(10,2), dados.valor_total);
        request.input("status", mssql.VarChar, "Pendente");
        request.input("endereco", mssql.VarChar, dados.endereco);
        request.input("cidade", mssql.VarChar, dados.cidade);
        request.input("estado", mssql.VarChar, dados.estado);
        request.input("cep", mssql.VarChar, dados.cep);
        request.input("forma_pagamento", mssql.VarChar, dados.forma_pagamento);

        const resultado = await request.query(`
            INSERT INTO pedidos
            (
                id_cliente,
                valor_total,
                status,
                endereco_entrega,
                cidade,
                estado,
                cep,
                forma_pagamento
            )
            OUTPUT INSERTED.id_pedido
            VALUES
            (
                @id_cliente,
                @valor_total,
                @status,
                @endereco,
                @cidade,
                @estado,
                @cep,
                @forma_pagamento
            )
        `);

        return resultado.recordset[0].id_pedido;

    }

    async buscar(idPedido) {

        const request = new mssql.Request();

        request.input("id", mssql.Int, idPedido);

        const resultado = await request.query(`
            SELECT *
            FROM pedidos
            WHERE id_pedido = @id
        `);

        return resultado.recordset[0];

    }

}

export default new CompraModelo();