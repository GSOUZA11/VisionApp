
import mssql from 'mssql';
import { conectar } from '../config/db.mjs';

class CarrinhoModelo {

  // Listar somente os itens do cliente logado
  async listar(clienteId) {
    await conectar();

    const resultado = await new mssql.Request()
      .input('cliente_id', mssql.Int, clienteId)
      .query(`
        SELECT
          c.id,
          c.quantidade,
          c.oculos_id,
          o.nome,
          o.preco,
          o.cor,
          o.tamanho,
          o.imagem
        FROM carrinho c
        INNER JOIN Oculos o
          ON o.id = c.oculos_id
        WHERE c.cliente_id = @cliente_id
        ORDER BY c.id DESC
      `);

    return resultado.recordset;
  }

  // Adicionar produto ao carrinho do cliente
  async adicionar(clienteId, oculosId, quantidade) {
    await conectar();

    const produtoResultado = await new mssql.Request()
      .input('oculos_id', mssql.Int, oculosId)
      .query(`
        SELECT id, nome, estoque
        FROM Oculos
        WHERE id = @oculos_id
      `);

    const produto = produtoResultado.recordset[0];

    if (!produto) {
      throw new Error('Produto não encontrado. Verifique o ID do óculos.');
    }

    if (
      produto.estoque == null ||
      Number(quantidade) > Number(produto.estoque)
    ) {
      throw new Error('Estoque insuficiente para essa quantidade.');
    }

    const carrinhoResultado = await new mssql.Request()
      .input('cliente_id', mssql.Int, clienteId)
      .input('oculos_id', mssql.Int, oculosId)
      .query(`
        SELECT id, quantidade
        FROM carrinho
        WHERE cliente_id = @cliente_id
          AND oculos_id = @oculos_id
      `);

    const item = carrinhoResultado.recordset[0];

    if (item) {
      const novaQuantidade =
        Number(item.quantidade) + Number(quantidade);

      if (novaQuantidade > Number(produto.estoque)) {
        throw new Error(
          'A quantidade solicitada excede o estoque disponível.'
        );
      }

      await new mssql.Request()
        .input('id', mssql.Int, item.id)
        .input('cliente_id', mssql.Int, clienteId)
        .input('quantidade', mssql.Int, novaQuantidade)
        .query(`
          UPDATE carrinho
          SET quantidade = @quantidade
          WHERE id = @id
            AND cliente_id = @cliente_id
        `);
    } else {
      await new mssql.Request()
        .input('cliente_id', mssql.Int, clienteId)
        .input('oculos_id', mssql.Int, oculosId)
        .input('quantidade', mssql.Int, quantidade)
        .query(`
          INSERT INTO carrinho
            (cliente_id, oculos_id, quantidade)
          VALUES
            (@cliente_id, @oculos_id, @quantidade)
        `);
    }
  }

  // Aumentar a quantidade de um item
  async aumentar(clienteId, id) {
    await conectar();

    await new mssql.Request()
      .input('id', mssql.Int, id)
      .input('cliente_id', mssql.Int, clienteId)
      .query(`
        UPDATE carrinho
        SET quantidade = quantidade + 1
        WHERE id = @id
          AND cliente_id = @cliente_id
      `);
  }

  // Diminuir a quantidade de um item
  async diminuir(clienteId, id) {
    await conectar();

    const resultado = await new mssql.Request()
      .input('id', mssql.Int, id)
      .input('cliente_id', mssql.Int, clienteId)
      .query(`
        SELECT id, quantidade
        FROM carrinho
        WHERE id = @id
          AND cliente_id = @cliente_id
      `);

    const item = resultado.recordset[0];

    if (!item) return;

    if (Number(item.quantidade) <= 1) {
      return this.remover(clienteId, id);
    }

    await new mssql.Request()
      .input('id', mssql.Int, id)
      .input('cliente_id', mssql.Int, clienteId)
      .query(`
        UPDATE carrinho
        SET quantidade = quantidade - 1
        WHERE id = @id
          AND cliente_id = @cliente_id
      `);
  }

  // Remover um item do carrinho
  async remover(clienteId, id) {
    await conectar();

    await new mssql.Request()
      .input('id', mssql.Int, id)
      .input('cliente_id', mssql.Int, clienteId)
      .query(`
        DELETE FROM carrinho
        WHERE id = @id
          AND cliente_id = @cliente_id
      `);
  }
}

export default new CarrinhoModelo();
