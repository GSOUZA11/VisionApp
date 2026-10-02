import mssql from 'mssql'
import { conectar }
from '../config/db.mjs'

export async function criarAdmin(){

    await conectar()

    const existe =
        await new mssql.Request()
        .query(`
            SELECT COUNT(*) total
            FROM Funcionario
        `)

    if(
        existe.recordset[0].total > 0
    ){
        return
    }

    await new mssql.Request()
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
            'admin',
            'Administrador',
            'admin@vision.com',
            HASHBYTES(
                'SHA2_256',
                '123456'
            ),
            'Administrador'
        )
    `)
}