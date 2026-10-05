import mssql from 'mssql'
import { conectar } from '../config/db.mjs'

export default class ClienteModelo {

    static async listar() {

        await conectar()

        const resultado =
            await new mssql.Request()
                .query(`
                    SELECT *
                    FROM Cliente
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
                    WHERE id=@id
                `)

        return resultado.recordset[0]
    }

    static async criar(
        nome,
        telefone,
        email,
        senha
    ) {

        console.log('CLIENTE MODELO CRIAR EXECUTADO')
        console.log({
            nome,
            telefone,
            email,
            senha
        })

        await conectar()

        await new mssql.Request()
            .input(
                'nome',
                mssql.VarChar,
                nome
            )
            .input(
                'telefone',
                mssql.VarChar,
                telefone
            )
            .input(
                'email',
                mssql.VarChar,
                email
            )
            .input(
                'senha',
                mssql.VarChar,
                senha
            )
            .query(`
            INSERT INTO Cliente
            (
                nome,
                telefone,
                email,
                senha
            )
            VALUES
            (
                @nome,
                @telefone,
                @email,
                HASHBYTES(
                    'SHA2_256',
                    @senha
                )
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
                mssql.VarChar,
                nome
            )
            .input(
                'telefone',
                mssql.VarChar,
                telefone
            )
            .input(
                'email',
                mssql.VarChar,
                email
            )
            .query(`
                UPDATE Cliente
                SET
                    nome=@nome,
                    telefone=@telefone,
                    email=@email
                WHERE id=@id
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
                WHERE id=@id
            `)
    }

    static async autenticar(
        email,
        senha
    ) {

        console.log('AUTENTICANDO CLIENTE')
        console.log(email)
        console.log(senha)

        await conectar()

        const resultado =
            await new mssql.Request()
                .input(
                    'email',
                    mssql.VarChar,
                    email
                )
                .input(
                    'senha',
                    mssql.VarChar,
                    senha
                )
                .query(`
                SELECT TOP 1 *
                FROM Cliente
                WHERE
                    email = @email
                    AND senha = HASHBYTES(
                        'SHA2_256',
                        @senha
                    )
                    AND ativo = 1
            `)
        console.log(resultado.recordset)

        return resultado.recordset[0]
    }
}