
import CarrinhoModelo from "../models/carrinhoModelo.mjs";

class EntregaControle {
    async index(req, res) {
        try {
            const usuario = req.session?.usuario;

            if (!usuario) {
                return res.redirect("/autenticacao/login");
            }

            const clienteId = Number(usuario.id);

            if (!Number.isInteger(clienteId) || clienteId <= 0) {
                return res.status(400).send("ID do cliente inválido.");
            }

            const produtos = await CarrinhoModelo.listar(clienteId);

            if (!produtos || produtos.length === 0) {
                return res.redirect("/carrinho");
            }

            const subtotal = produtos.reduce(
                (total, item) =>
                    total + Number(item.preco) * Number(item.quantidade),
                0
            );

            const frete = subtotal >= 300 ? 0 : 25;
            const total = subtotal + frete;

            return res.render("entrega/index", {
                titulo: "Entrega",
                produtos,
                subtotal,
                frete,
                total
            });
        } catch (erro) {
            console.error("Erro ao carregar a entrega:", erro);

            return res.status(500).render("erro", {
                mensagem: "Erro ao carregar página de entrega."
            });
        }
    }

    async salvar(req, res) {
        try {
            const usuario = req.session?.usuario;

            if (!usuario) {
                return res.redirect("/autenticacao/login");
            }

            const clienteId = Number(usuario.id);

            if (!Number.isInteger(clienteId) || clienteId <= 0) {
                return res.status(400).send("ID do cliente inválido.");
            }

            const {
                nome,
                sobrenome,
                cpf,
                email,
                telefone,
                endereco,
                cidade,
                estado,
                cep
            } = req.body;

            if (
                !nome || !sobrenome || !email || !telefone ||
                !endereco || !cidade || !estado || !cep
            ) {
                return res.status(400).send(
                    "Preencha todos os campos obrigatórios da entrega."
                );
            }

            const produtos = await CarrinhoModelo.listar(clienteId);

            if (!produtos || produtos.length === 0) {
                return res.redirect("/carrinho");
            }

            const subtotal = produtos.reduce(
                (total, item) =>
                    total + Number(item.preco) * Number(item.quantidade),
                0
            );

            const frete = subtotal >= 300 ? 0 : 25;

            req.session.entrega = {
                cliente_id: clienteId,
                nome,
                sobrenome,
                cpf: cpf || "",
                email,
                telefone,
                endereco,
                cidade,
                estado,
                cep,
                subtotal,
                frete,
                total: subtotal + frete
            };

            return res.redirect("/pagamento");
        } catch (erro) {
            console.error("Erro ao processar a entrega:", erro);

            return res.status(500).render("erro", {
                mensagem: "Não foi possível processar os dados da entrega."
            });
        }
    }
}

export default new EntregaControle();
