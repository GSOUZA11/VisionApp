import mssql from "mssql";
import { conectar } from "../config/db.mjs";

export default class OculosModelo {
  static async obterTodosOsOculos() {
    await conectar();

    const resultado = await new mssql.Request().query(`
                SELECT *
                FROM Oculos
                ORDER BY nome
            `);

    return resultado.recordset;
  }

  static async buscarPorId(id) {
    await conectar();

    const resultado = await new mssql.Request().input("id", mssql.Int, id)
      .query(`
                SELECT *
                  FROM Oculos
                  WHERE id=@id
            `);

    return resultado.recordset[0];
  }

  static async criar(dados) {

    await conectar()

    await new mssql.Request()
      .input("nome", mssql.NVarChar, dados.nome)
      .input("descricao", mssql.NVarChar, dados.descricao)
      .input("categoria", mssql.NVarChar, dados.categoria)
      .input("cor", mssql.NVarChar, dados.cor)
      .input("tamanho", mssql.NVarChar, dados.tamanho)
      .input(
        "preco",
        mssql.Decimal(10, 2),
        parseFloat(dados.preco)
      )
      .input("estoque", mssql.Int, dados.estoque)
      .input("imagem", mssql.NVarChar, dados.imagem)
      .query(`
            INSERT INTO Oculos
            (
                nome,
                descricao,
                categoria,
                cor,
                tamanho,
                preco,
                estoque,
                imagem
            )
            VALUES
            (
                @nome,
                @descricao,
                @categoria,
                @cor,
                @tamanho,
                @preco,
                @estoque,
                @imagem
            )
        `)
  }

  static async atualizar(id, dados) {
    await conectar();

    await new mssql.Request()
      .input("id", mssql.Int, id)
      .input("nome", mssql.NVarChar, dados.nome)
      .input("grau", mssql.NVarChar, dados.grau)
      .input("cor", mssql.NVarChar, dados.cor)
      .input("material", mssql.NVarChar, dados.material)
      .input("preco", mssql.Decimal(10, 2), dados.preco)
      .input("imagem", mssql.NVarChar, dados.imagem)
      .input("estoque", mssql.Int, dados.estoque).query(`
                UPDATE Oculos
                 SET
                 nome=@nome,
                 grau=@grau,
                 cor=@cor,
                 material=@material,
                 preco=@preco,
                 imagem=@imagem,
                 estoque=@estoque
             WHERE id=@id
            `);
  }

  static async remover(id) {
    await conectar();

    await new mssql.Request().input("id", mssql.Int, id).query(`
                DELETE FROM Oculos
                WHERE id=@id
            `);
  }
  static async listarPorTipo(categoria) {
    await conectar();

    const resultado = await new mssql.Request()
      .input("categoria", mssql.NVarChar, categoria)
      .query(`
                SELECT *
                FROM Oculos
                WHERE categoria = @categoria
                ORDER BY nome
            `);

    return resultado.recordset;
  }


  static async listarPorGrau() {

    await conectar()

    const resultado =
      await new mssql.Request()
        .query(`
                SELECT *
                FROM Oculos
            `)

    console.log(resultado.recordset)

    return resultado.recordset
  }
  static async contar() {
    await conectar();

    const resultado = await new mssql.Request().query(`
            SELECT
                COUNT(*) total
            FROM Oculos
        `);

    return resultado.recordset[0].total;
  }

  static async pesquisar(nome) {
    await conectar();

    const resultado = await new mssql.Request().input(
      "nome",
      mssql.NVarChar,
      `%${nome}%`,
    ).query(`
            SELECT *
            FROM Oculos
            WHERE nome LIKE @nome
        `);

    return resultado.recordset;
  }

  static async listarPaginado(pagina = 1, limite = 10) {
    const offset = (pagina - 1) * limite;
  }

  static async filtrar(filtros) {
    nome;
    cor;
    material;
    grau;
  }
}
