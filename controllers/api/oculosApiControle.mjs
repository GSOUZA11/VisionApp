import OculosModelo from '../../models/oculosModelo.mjs'

// Converte o :id da URL em inteiro positivo (ou null se for inválido)
function lerId(req) {
  const id = Number(req.params.id)
  return Number.isInteger(id) && id > 0 ? id : null
}

// Valida os campos obrigatórios; devolve uma lista de mensagens de erro
function validar(dados) {
  const erros = []
  const preco = Number(dados.preco)
  const estoque = Number(dados.estoque ?? 0)

  if (!dados.nome || !String(dados.nome).trim()) erros.push('nome é obrigatório')
  if (!dados.marca || !String(dados.marca).trim()) erros.push('marca é obrigatória')
  if (!Number.isFinite(preco) || preco <= 0) erros.push('preco deve ser maior que 0')
  if (!Number.isInteger(estoque) || estoque < 0) erros.push('estoque deve ser um inteiro >= 0')

  return erros
}

const oculosApiControle = {

  // GET /api/oculos ou /api/oculos?tipo=Esportivo
  async listar(req, res) {
    try {
      const tipo = typeof req.query.tipo === 'string' ? req.query.tipo.trim() : ''

      const oculos = tipo
        ? await OculosModelo.listarPorTipo(tipo)
        : await OculosModelo.obterTodosOsOculos()

      return res.status(200).json(oculos)

    } catch (error) {
      console.error(error)
      return res.status(500).json({ mensagem: 'Erro interno ao buscar óculos.' })
    }
  },

  // GET /api/oculos/:id
  async buscar(req, res) {
    try {
      const id = lerId(req)
      if (!id) return res.status(400).json({ mensagem: 'ID inválido.' })

      const oculos = await OculosModelo.buscarPorId(id)
      if (!oculos) return res.status(404).json({ mensagem: 'Óculos não encontrado.' })

      return res.status(200).json(oculos)

    } catch (error) {
      console.error(error)
      return res.status(500).json({ mensagem: 'Erro interno ao buscar óculos.' })
    }
  },

  // POST /api/oculos
  async criar(req, res) {
    try {
      const erros = validar(req.body)
      if (erros.length) {
        return res.status(400).json({ mensagem: 'Dados inválidos.', erros })
      }

      const id = await OculosModelo.criar({
        ...req.body,
        nome: String(req.body.nome).trim(),
        marca: String(req.body.marca).trim()
      })

      const criado = await OculosModelo.buscarPorId(id)

      return res
        .status(201)
        .location(`/api/oculos/${id}`)
        .json(criado)

    } catch (error) {
      console.error(error)
      return res.status(500).json({ mensagem: 'Erro interno ao cadastrar óculos.' })
    }
  },

  // PUT /api/oculos/:id
  async atualizar(req, res) {
    try {
      const id = lerId(req)
      if (!id) return res.status(400).json({ mensagem: 'ID inválido.' })

      const existente = await OculosModelo.buscarPorId(id)
      if (!existente) return res.status(404).json({ mensagem: 'Óculos não encontrado.' })

      // Mescla: o que não vier no corpo mantém o valor atual
      const dados = { ...existente, ...req.body }

      const erros = validar(dados)
      if (erros.length) {
        return res.status(400).json({ mensagem: 'Dados inválidos.', erros })
      }

      await OculosModelo.atualizar(id, {
        ...dados,
        nome: String(dados.nome).trim(),
        marca: String(dados.marca).trim()
      })

      const atualizado = await OculosModelo.buscarPorId(id)
      return res.status(200).json(atualizado)

    } catch (error) {
      console.error(error)
      return res.status(500).json({ mensagem: 'Erro interno ao atualizar óculos.' })
    }
  },

  // DELETE /api/oculos/:id
  async remover(req, res) {
    try {
      const id = lerId(req)
      if (!id) return res.status(400).json({ mensagem: 'ID inválido.' })

      const existente = await OculosModelo.buscarPorId(id)
      if (!existente) return res.status(404).json({ mensagem: 'Óculos não encontrado.' })

      await OculosModelo.remover(id)
      return res.status(204).end()

    } catch (error) {
      // 547 = violação de chave estrangeira no SQL Server (óculos em carrinho/pedido)
      if (error.number === 547) {
        return res.status(409).json({
          mensagem: 'Não é possível excluir: o óculos está em um carrinho ou pedido.'
        })
      }

      console.error(error)
      return res.status(500).json({ mensagem: 'Erro interno ao excluir óculos.' })
    }
  }
}

export default oculosApiControle
