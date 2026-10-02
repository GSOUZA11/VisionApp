import mssql from "mssql";
import { conectar } from "../config/db.mjs";

export default class OculosModelo {
  static async listar() {
    await conectar();

    const resultado = await new mssql.Request().query(`
                SELECT *
                FROM Oculos
                ORDER BY nome
            `);

          

    return resultado.recordset;
  }

  static async obterTodosOsOculos() {
    await conectar();

    const resultado = await new mssql.Request().query(`
                SELECT *
                FROM Oculos
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
    await conectar();

    await new mssql.Request()
      .input("nome", mssql.NVarChar, dados.nome)
      .input("marca", mssql.NVarChar, dados.marca)
      .input("grau", mssql.NVarChar, dados.grau)
      .input("cor", mssql.NVarChar, dados.cor)
      .input("material", mssql.NVarChar, dados.material)
      .input("preco", mssql.Decimal(10, 2), dados.preco)
      .input("imagem", mssql.NVarChar, dados.imagem)
      .input("estoque", mssql.Int, dados.estoque).query(`
                INSERT INTO Oculos
                (
                    nome,
                    marca,
                    grau,
                    cor,
                    material,
                    preco,
                    imagem,
                    estoque
                )
                VALUES
                (
                    @nome,
                    @marca,
                    @grau,
                    @cor,
                    @material,
                    @preco,
                    @imagem,
                    @estoque
                )
            `);
  }

  static async atualizar(id, dados) {
    await conectar();

    await new mssql.Request()
      .input("id", mssql.Int, id)
      .input("nome", mssql.NVarChar, dados.nome)
      .input("marca", mssql.NVarChar, dados.marca)
      .input("grau", mssql.NVarChar, dados.grau)
      .input("cor", mssql.NVarChar, dados.cor)
      .input("material", mssql.NVarChar, dados.material)
      .input("preco", mssql.Decimal(10, 2), dados.preco)
      .input("imagem", mssql.NVarChar, dados.imagem)
      .input("estoque", mssql.Int, dados.estoque).query(`
                UPDATE Oculos
                 SET
                 nome=@nome,
                 marca=@marca,
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
    marca;
    cor;
    material;
    grau;
  }
}
