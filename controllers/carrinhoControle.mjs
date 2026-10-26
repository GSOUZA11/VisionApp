
import CarrinhoModelo from "../models/carrinhoModelo.mjs";

function requisicaoAjax(req) {
    return (
        req.get("X-Requested-With") === "XMLHttpRequest" ||
        (req.get("Accept") || "").includes("application/json")
    );
}

async function obterDadosFormulario(req) {
    if (req.body && Object.keys(req.body).length > 0) {
        return req.body;
    }

    const contentType = req.get("Content-Type") || "";

    if (!contentType.includes("application/x-www-form-urlencoded")) {
        return {};
    }

    let corpo = "";

    for await (const parte of req) {
        corpo += parte.toString();
    }

    return Object.fromEntries(new URLSearchParams(corpo));
}

function responderErro(req, res, status, mensagem, extras = {}) {
    if (requisicaoAjax(req)) {
        return res.status(status).json({
            success: false,
            erro: mensagem,
            ...extras
        });
    }

    return res.status(status).send(mensagem);
}

class CarrinhoControle {

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

            const carrinho = await CarrinhoModelo.listar(clienteId);

            const subtotal = carrinho.reduce((total, item) => {
                return total + Number(item.preco) * Number(item.quantidade);
            }, 0);

            const frete = subtotal >= 300 ? 0 : 25;
            const total = subtotal + frete;

            return res.render("carrinho/index", {
                carrinho,
                subtotal,
                frete,
                total
            });

        } catch (erro) {
            console.error("Erro ao carregar carrinho:", erro);
            return res.status(500).send("Erro ao carregar o carrinho.");
        }
    }

    async adicionar(req, res) {
        try {
            const usuario = req.session?.usuario;

            if (!usuario) {
                if (requisicaoAjax(req)) {
                    return responderErro(
                        req,
                        res,
                        401,
                        "Você precisa entrar na sua conta para adicionar produtos.",
                        { loginUrl: "/autenticacao/login" }
                    );
                }

                return res.redirect("/autenticacao/login");
            }

            if (usuario.cargo !== "Cliente") {
                return responderErro(
                    req,
                    res,
                    403,
                    "Somente clientes podem adicionar produtos ao carrinho."
                );
            }

            const dados = await obterDadosFormulario(req);

            const clienteId = Number(usuario.id);
            const oculosId = Number(req.params.id);
            const quantidade = Number(dados.quantidade);

            if (
                !Number.isInteger(clienteId) || clienteId <= 0 ||
                !Number.isInteger(oculosId) || oculosId <= 0 ||
                !Number.isInteger(quantidade) || quantidade < 1
            ) {
                return responderErro(
                    req,
                    res,
                    400,
                    "Dados do produto inválidos. Confira a quantidade e tente novamente."
                );
            }

            await CarrinhoModelo.adicionar(
                clienteId,
                oculosId,
                quantidade
            );

            if (requisicaoAjax(req)) {
                return res.status(200).json({
                    success: true,
                    mensagem: "Produto adicionado ao carrinho!",
                    redirectUrl: "/carrinho",
                    oculosId,
                    quantidade
                });
            }

            return res.redirect("/carrinho");

        } catch (erro) {
            console.error("Erro ao adicionar produto ao carrinho:", erro);

            return responderErro(
                req,
                res,
                400,
                erro.message || "Não foi possível adicionar o produto ao carrinho."
            );
        }
    }

    async aumentar(req, res) {
        try {
            const usuario = req.session?.usuario;

            if (!usuario) {
                return res.redirect("/autenticacao/login");
            }

            await CarrinhoModelo.aumentar(
                Number(usuario.id),
                Number(req.params.id)
            );

            return res.redirect("/carrinho");

        } catch (erro) {
            console.error("Erro ao aumentar quantidade:", erro);
            return res.status(500).send("Erro ao aumentar a quantidade.");
        }
    }

    async diminuir(req, res) {
        try {
            const usuario = req.session?.usuario;

            if (!usuario) {
                return res.redirect("/autenticacao/login");
            }

            await CarrinhoModelo.diminuir(
                Number(usuario.id),
                Number(req.params.id)
            );

            return res.redirect("/carrinho");

        } catch (erro) {
            console.error("Erro ao diminuir quantidade:", erro);
            return res.status(500).send("Erro ao diminuir a quantidade.");
        }
    }

    async remover(req, res) {
        try {
            const usuario = req.session?.usuario;

            if (!usuario) {
                return res.redirect("/autenticacao/login");
            }

            await CarrinhoModelo.remover(
                Number(usuario.id),
                Number(req.params.id)
            );

            return res.redirect("/carrinho");

        } catch (erro) {
            console.error("Erro ao remover item:", erro);
            return res.status(500).send("Erro ao remover o item.");
        }
    }
}

export default new CarrinhoControle();
