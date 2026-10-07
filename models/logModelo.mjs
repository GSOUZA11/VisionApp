import mssql from 'mssql'
import { conectar } from '../config/db.mjs'

export default class LogModelo {

    static async registrar(
        mensagem
    ) {

        await conectar()

        await new mssql.Request()
            .input(
                'mensagem',
                mssql.NVarChar,
                mensagem
            )
            .query(`
                INSERT INTO Log
                (
                    mensagem
                )
                VALUES
                (
                    @mensagem
                )
            `)
    }

    static async listar() {

        await conectar()

        const resultado =
            await new mssql.Request()
                .query(`
                    SELECT *
                    FROM Log
                    ORDER BY dataCriacao DESC
                `)

        return resultado.recordset
    }
}