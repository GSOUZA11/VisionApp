import db from '../database/db.mjs'

class LoginModelo {

    async buscarPorEmail(email) {

        return await banco.get(
            `
            SELECT *
            FROM clientes
            WHERE email = ?
            `,
            [email]
        )

    }

}

export default new LoginModelo()