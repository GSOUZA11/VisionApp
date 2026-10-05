import mssql from 'mssql'
import { conectar } from '../config/db.mjs'

export default class CadastroModelo {

    static async listar() {

        await conectar()

        const resultado =
            await new mssql.Request()
                .query(`
                    SELECT *
                    FROM Cliente
                    ORDER BY nome
                `)

        return resultado.recordset
    }

    static async buscarPorId(id) {

        await conectar()

        const resultado =
            await new mssql.Request()
                .input(
                    'id',
                    mssql.Int,
                    id
                )
                .query(`
                    SELECT *
                    FROM Cliente
                    WHERE id = @id
                `)

        return resultado.recordset[0]
    }

    static async buscarPorEmail(email) {

        await conectar()

        const resultado =
            await new mssql.Request()
                .input(
                    'email',
                    mssql.NVarChar,
                    email
                )
                .query(`
                    SELECT *
                    FROM Cliente
                    WHERE email = @email
                `)

        return resultado.recordset[0]
    }

    static async criar(
        nome,
        telefone,
        email
    ) {

        await conectar()

        await new mssql.Request()
            .input(
                'nome',
                mssql.NVarChar,
                nome
            )
            .input(
                'telefone',
                mssql.NVarChar,
                telefone
            )
            .input(
                'email',
                mssql.NVarChar,
                email
            )
            .query(`
                INSERT INTO Cliente
                (
                    nome,
                    telefone,
                    email
                )
                VALUES
                (
                    @nome,
                    @telefone,
                    @email
                )
            `)
    }

    static async atualizar(
        id,
        nome,
        telefone,
        email
    ) {

        await conectar()

        await new mssql.Request()
            .input(
                'id',
                mssql.Int,
                id
            )
            .input(
                'nome',
                mssql.NVarChar,
                nome
            )
            .input(
                'telefone',
                mssql.NVarChar,
                telefone
            )
            .input(
                'email',
                mssql.NVarChar,
                email
            )
            .query(`
                UPDATE Cliente
                SET
                    nome = @nome,
                    telefone = @telefone,
                    email = @email
                WHERE id = @id
            `)
    }

    static async remover(id) {

        await conectar()

        await new mssql.Request()
            .input(
                'id',
                mssql.Int,
                id
            )
            .query(`
                UPDATE Cliente
                SET ativo = 0
                WHERE id = @id
            `)
    }
}