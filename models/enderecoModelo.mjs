import banco from './banco.mjs';

class EnderecoModelo {

    async cadastrar(dados) {

        const sql = `

            INSERT INTO enderecos
            (
                cliente_id,
                nome,
                sobrenome,
                cpf,
                email,
                telefone,
                endereco,
                cidade,
                estado,
                cep
            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

        `;

        return banco.run(sql, [

            dados.cliente_id,

            dados.nome,

            dados.sobrenome,

            dados.cpf,

            dados.email,

            dados.telefone,

            dados.endereco,

            dados.cidade,

            dados.estado,

            dados.cep

        ]);

    }

}

export default new EnderecoModelo();