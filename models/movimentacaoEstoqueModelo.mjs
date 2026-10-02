import mssql from 'mssql'
import { conectar } from '../config/db.mjs'

export default class MovimentacaoEstoqueModelo {

    static async registrar(

        oculosID,
        tipo,
        quantidade,
        transaction = null

    ) {

        if (!transaction) {

            await conectar()

        }

        const request = transaction

            ? new mssql.Request(
                transaction
            )

            : new mssql.Request()

        await request

            .input(
                'oculosID',
                mssql.Int,
                oculosID
            )

            .input(
                'tipo',
                mssql.NVarChar,
                tipo
            )

            .input(
                'quantidade',
                mssql.Int,
                quantidade
            )

            .query(`
                INSERT INTO
                MovimentacaoEstoque
                (
                    oculosID,
                    tipo,
                    quantidade
                )
                VALUES
                (
                    @oculosID,
                    @tipo,
                    @quantidade
                )
            `)
    }
}