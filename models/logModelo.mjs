import mssql from 'mssql'
import { conectar } from '../config/db.mjs'

export default class LoginModelo {

    static async buscarPorEmail(email) {

        await conectar()

        const resultado = await new mssql.Request()
            .input('email', mssql.NVarChar, email)
            .query(`
                SELECT *
                FROM Cliente
                WHERE email = @email
            `)

        return resultado.recordset[0]
    }
}