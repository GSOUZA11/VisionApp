import mssql from 'mssql'
import { conectar } from '../config/db.mjs'

export async function inicializarBanco() {

    await conectar()

    await new mssql.Request().query(`

        IF NOT EXISTS (
            SELECT *
            FROM sysobjects
            WHERE name='Cliente'
            AND xtype='U'
        )
        BEGIN

            CREATE TABLE Cliente(
                id INT IDENTITY(1,1) PRIMARY KEY,
                uid UNIQUEIDENTIFIER DEFAULT NEWID(),
                nome NVARCHAR(200),
                telefone NVARCHAR(50),
                email NVARCHAR(255)
            )

        END

    `)

}