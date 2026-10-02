import mssql from 'mssql'
import { conectar } from '../config/db.mjs'

class CarrinhoModelo {

  async listar() {
    await conectar()

    const resultado = await new mssql.Request()
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
        INNER JOIN oculos o
          ON o.id = c.oculos_id
        ORDER BY c.id DESC
      `)

    return resultado.recordset
  }

  async aumentar(id) {
    await conectar()

    await new mssql.Request()
      .input('id', mssql.Int, id)
      .query(`
        UPDATE carrinho
        SET quantidade = quantidade + 1
        WHERE id = @id
      `)
  }

  async diminuir(id) {
    await conectar()

    const resultado = await new mssql.Request()
      .input('id', mssql.Int, id)
      .query(`
        SELECT quantidade
        FROM carrinho
        WHERE id = @id
      `)

    const item = resultado.recordset[0]

    if (!item) return

    if (item.quantidade <= 1) {
      return this.remover(id)
    }

    await new mssql.Request()
      .input('id', mssql.Int, id)
      .query(`
        UPDATE carrinho
        SET quantidade = quantidade - 1
        WHERE id = @id
      `)
  }

  async remover(id) {
    await conectar()

    await new mssql.Request()
      .input('id', mssql.Int, id)
      .query(`
        DELETE FROM carrinho
        WHERE id = @id
      `)
  }

}

export default new CarrinhoModelo()