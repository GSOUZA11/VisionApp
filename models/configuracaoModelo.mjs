import mssql from 'mssql'
import { conectar } from '../config/db.mjs'

export default class configuracaoModelo {

    static async obter() {

        await conectar()

        const resultado =
            await new mssql.Request()
                .query(`
                SELECT TOP 1 *
                FROM Configuracao
            `)

        return resultado.recordset[0]
    }

    static async atualizar(dados) {

        await conectar()

        const existe =
            await new mssql.Request()
                .query(`
            SELECT COUNT(*) total
            FROM Configuracao
        `)

        if (
            existe.recordset[0].total === 0
        ) {

            await new mssql.Request()
                .input(
                    'nomeLoja',
                    mssql.NVarChar,
                    dados.nomeLoja
                )
                .input(
                    'telefone',
                    mssql.NVarChar,
                    dados.telefone
                )
                .input(
                    'email',
                    mssql.NVarChar,
                    dados.email
                )
                .input(
                    'endereco',
                    mssql.NVarChar,
                    dados.endereco
                )
                .query(`
            INSERT INTO Configuracao
            (
                nomeLoja,
                telefone,
                email,
                endereco
            )
            VALUES
            (
                @nomeLoja,
                @telefone,
                @email,
                @endereco
            )
        `)

            return
        }

        await new mssql.Request()
            .input(
                'nomeLoja',
                mssql.NVarChar,
                dados.nomeLoja
            )
            .input(
                'telefone',
                mssql.NVarChar,
                dados.telefone
            )
            .input(
                'email',
                mssql.NVarChar,
                dados.email
            )
            .input(
                'endereco',
                mssql.NVarChar,
                dados.endereco
            )
            .query(`
        UPDATE Configuracao
        SET
            nomeLoja=@nomeLoja,
            telefone=@telefone,
            email=@email,
            endereco=@endereco
    `)
    }

}