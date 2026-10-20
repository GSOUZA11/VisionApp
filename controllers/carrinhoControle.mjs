
import CarrinhoModelo from "../models/carrinhoModelo.mjs";

class CarrinhoControle {

  // Exibir carrinho
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

      let subtotal = 0;

      carrinho.forEach(item => {
        subtotal += Number(item.preco) * Number(item.quantidade);
      });

      const frete = subtotal >= 300 ? 0 : 25;
      const total = subtotal + frete;

      return res.render("carrinho/index", {
        carrinho,
        subtotal,
        frete,
        total
      });
    } catch (erro) {
      console.error(erro);
      return res.status(500).send("Erro ao carregar o carrinho.");
    }
  }

  // Adicionar produto
  async adicionar(req, res) {
    try {
      const usuario = req.session?.usuario;

      if (!usuario) {
        return res.redirect("/autenticacao/login");
      }

      if (usuario.cargo !== "Cliente") {
        return res.status(403).send(
          "Somente clientes podem adicionar produtos ao carrinho."
        );
      }

      const clienteId = Number(usuario.id);
      const oculosId = Number(req.params.id);
      const quantidade = Number(req.body.quantidade);

      if (
        !Number.isInteger(clienteId) || clienteId <= 0 ||
        !Number.isInteger(oculosId) || oculosId <= 0 ||
        !Number.isInteger(quantidade) || quantidade < 1
      ) {
        return res.status(400).send("Dados do produto inválidos.");
      }

      await CarrinhoModelo.adicionar(
        clienteId,
        oculosId,
        quantidade
      );

      return res.redirect("/carrinho");
    } catch (erro) {
      console.error(erro);
      return res.status(400).send(erro.message);
    }
  }

  // Aumentar quantidade
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
      console.error(erro);
      return res.status(500).send("Erro ao aumentar a quantidade.");
    }
  }

  // Diminuir quantidade
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
      console.error(erro);
      return res.status(500).send("Erro ao diminuir a quantidade.");
    }
  }

  // Remover item
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
      console.error(erro);
      return res.status(500).send("Erro ao remover o item.");
    }
  }
}

export default new CarrinhoControle();
