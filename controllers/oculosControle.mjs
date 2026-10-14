import OculosModelo from '../models/oculosModelo.mjs'
import LogModelo from '../models/logModelo.mjs'

// tipo (query string) -> categoria no banco + view + título
const TIPOS = {
    esportivo: {
        categoria: 'Esportivo',
        view: 'oculos/index',
        titulo: 'Óculos Esportivos em Destaque'
    },
    sol: {
        categoria: 'Sol',
        view: 'oculos/index',
        titulo: 'Óculos de Sol em Destaque'
    },
    vintage: {
        categoria: 'Vintage',
        view: 'oculos/index',
        titulo: 'Óculos Vintage em Destaque'
    },
    classico: {
        categoria: 'Classico',
        view: 'oculos/index',
        titulo: 'Óculos Clássicos'
    },
    fashion: {
        categoria: 'Fashion',
        view: 'oculos/index',
        titulo: 'Óculos Fashion'
    },
    grau: {
        view: 'oculos/index',
        titulo: 'Óculos de Grau'
    }
}

const oculosControle = {

    async index(req, res) {

        const oculos =
            await OculosModelo.listar()

        return res.render(
            'oculos/index',
            { oculos }
        )
    },

    async completo(req, res) {

        const oculos =
            await OculosModelo.listar()

        res.render(
            'oculos/index',
            {
                title: 'Todos os Óculos',
                pagina: 'catalogo',
                oculos
            }
        )
    },

    // GET /oculos?tipo=esportivo
    async tipo(req, res) {

        const chave =
            String(req.query.tipo || '')
                .toLowerCase()

        const config = TIPOS[chave]

        if (!config) {
            return res
                .status(404)
                .send('Tipo de óculos inválido')
        }

        const oculos =
            chave === 'grau'
                ? await OculosModelo.listarPorGrau()
                : await OculosModelo.listarPorTipo(
                    config.categoria
                )

        return res.render(
            config.view,
            {
                title: config.titulo,
                titulo: config.titulo,
                mensagemVazia: config.mensagemVazia,
                pagina: 'catalogo',
                oculos,
                produtos: oculos
            }
        )
    },

    async novo(req, res) {

        return res.render(
            'oculos/novo'
        )
    },

    async criar(req, res) {

        try {

            if (
                !req.body.nome?.trim() ||
                !req.body.preco ||
                Number(req.body.preco) <= 0
            ) {
                return res
                    .status(400)
                    .send('Dados inválidos')
            }

            const imagem =
                req.file
                    ? req.file.filename
                    : null

            await OculosModelo.criar({

                nome: req.body.nome,
                descricao: req.body.descricao,
                categoria: req.body.categoria,
                cor: req.body.cor,
                tamanho: req.body.tamanho,
                preco: req.body.preco,
                estoque: req.body.estoque,
                imagem
            })

            await LogModelo.registrar(
                `Óculos atualizado: ${req.body.nome}`
            )

            return res.redirect('/oculos')

        } catch (erro) {

            console.error(erro)

            return res
                .status(500)
                .send('Erro ao cadastrar óculos')
        }
    },

    async editar(req, res) {

        const oculos =
            await OculosModelo.buscarPorId(
                req.params.id
            )

        res.render(
            'oculos/editar',
            { oculos }
        )
    },

    async atualizar(req, res) {

        await LogModelo.registrar(
            `Óculos atualizado: ${req.body.nome}`
        )

        const existente =
            await OculosModelo.buscarPorId(
                req.params.id
            )

        const imagem =
            req.file
                ? req.file.filename
                : existente.imagem


        await OculosModelo.atualizar(
            req.params.id,
            {
                ...req.body,
                imagem
            }
        )

        res.redirect('/oculos')
    },

    async excluir(req, res) {

        await LogModelo.registrar(
            `Óculos removido: ${req.body.nome}`
        )

        await OculosModelo.remover(
            req.params.id
        )

        res.redirect('/oculos/admin')
    },

    async admin(req, res) {

        const oculos =
            await OculosModelo.listar()

        return res.render(
            'oculos/admin',
            {
                oculos
            }
        )
    }

}



export default oculosControle