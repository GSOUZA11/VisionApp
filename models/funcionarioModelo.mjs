import mssql from 'mssql'
import { conectar } from '../config/db.mjs'

export default class FuncionarioModelo {

   static async autenticar(usuario, senha) {

    await conectar()

    const resultado =
        await new mssql.Request()
            .input('usuario', mssql.NVarChar, usuario)
            .query(`
                SELECT TOP 1 *
                FROM Funcionario
                WHERE
                    nomeUsuario = @usuario
                    OR email = @usuario
            `)

    const funcionario = resultado.recordset[0]

    return funcionario
}


    static async listar() {

        await conectar()

        const resultado =
            await new mssql.Request()
                .query(`
                    SELECT *
                    FROM Funcionario
                    ORDER BY nomeCompleto
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
                    FROM Funcionario
                    WHERE id=@id
                `)

        return resultado.recordset[0]
    }

    static async criar(dados) {

        await conectar()

        await new mssql.Request()
            .input(
                'nomeUsuario',
                mssql.NVarChar,
                dados.nomeUsuario
            )
            .input(
                'nomeCompleto',
                mssql.NVarChar,
                dados.nomeCompleto
            )
            .input(
                'email',
                mssql.NVarChar,
                dados.email
            )
            .input(
                'senha',
                mssql.NVarChar,
                dados.senha
            )
            .input(
                'cargo',
                mssql.NVarChar,
                dados.cargo
            )
            .query(`
                INSERT INTO Funcionario
                (
                    nomeUsuario,
                    nomeCompleto,
                    email,
                    senha,
                    cargo
                )
                VALUES
                (
                    @nomeUsuario,
                    @nomeCompleto,
                    @email,
                    HASHBYTES(
                        'SHA2_256',
                        @senha
                    ),
                    @cargo
                )
            `)
    }

    static async atualizar(
        id,
        dados
    ) {

        await conectar()

        await new mssql.Request()
            .input(
                'id',
                mssql.Int,
                id
            )
            .input(
                'nomeUsuario',
                mssql.NVarChar,
                dados.nomeUsuario
            )
            .input(
                'nomeCompleto',
                mssql.NVarChar,
                dados.nomeCompleto
            )
            .input(
                'email',
                mssql.NVarChar,
                dados.email
            )
            .input(
                'cargo',
                mssql.NVarChar,
                dados.cargo
            )
            .query(`
                UPDATE Funcionario
                SET
                    nomeUsuario=@nomeUsuario,
                    nomeCompleto=@nomeCompleto,
                    email=@email,
                    cargo=@cargo
                WHERE id=@id
            `)
    }

    static async atualizarSenha(
        id,
        senha
    ) {

        await conectar()

        await new mssql.Request()
            .input(
                'id',
                mssql.Int,
                id
            )
            .input(
                'senha',
                mssql.NVarChar,
                senha
            )
            .query(`
                UPDATE Funcionario
                SET senha=HASHBYTES(
                    'SHA2_256',
                    @senha
                )
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
                DELETE FROM Funcionario
                WHERE id=@id
            `)
    }
}