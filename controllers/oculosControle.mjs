
import OculosModelo from '../models/oculosModelo.mjs';
import LogModelo from '../models/logModelo.mjs';

const TIPOS = {
    esportivo: {
        categoria: 'Esportivo',
        titulo: 'Óculos Esportivos em Destaque'
    },
    sol: {
        categoria: 'Sol',
        titulo: 'Óculos de Sol em Destaque'
    },
    vintage: {
        categoria: 'Vintage',
        titulo: 'Óculos Vintage em Destaque'
    },
    classico: {
        categoria: 'Classico',
        titulo: 'Óculos Clássicos'
    },
    fashion: {
        categoria: 'Fashion',
        titulo: 'Óculos Fashion'
    },
    grau: {
        titulo: 'Óculos de Grau'
    }
};

const oculosControle = {
    async index(req, res) {
        try {
            const oculos = await OculosModelo.listar();

            return res.render('oculos/index', {
                oculos,
                titulo: 'Todos os Óculos'
            });
        } catch (erro) {
            console.error(erro);
            return res.status(500).send('Erro ao carregar os óculos');
        }
    },

    async completo(req, res) {
        try {
            const oculos = await OculosModelo.listar();

            return res.render('oculos/index', {
                oculos,
                titulo: 'Todos os Óculos',
                pagina: 'catalogo'
            });
        } catch (erro) {
            console.error(erro);
            return res.status(500).send('Erro ao carregar o catálogo');
        }
    },

    async tipo(req, res) {
        try {
            const chave = String(req.query.tipo || '').toLowerCase();
            const config = TIPOS[chave];

            if (!config) {
                return res.status(404).send('Tipo de óculos inválido');
            }

            let oculos = [];

            if (chave === 'grau') {
                oculos = await OculosModelo.listarPorGrau();
            } else {
                oculos = await OculosModelo.listarPorTipo(config.categoria);
            }

            return res.render('oculos/index', {
                title: config.titulo,
                titulo: config.titulo,
                pagina: 'catalogo',
                oculos
            });
        } catch (erro) {
            console.error(erro);
            return res.status(500).send('Erro ao carregar os óculos por tipo');
        }
    },

    async novo(req, res) {
        return res.render('oculos/novo');
    },

    async criar(req, res) {
        try {
            if (
                !req.body.nome?.trim() ||
                !req.body.preco ||
                Number(req.body.preco) <= 0
            ) {
                return res.status(400).send('Dados inválidos');
            }

            const imagem = req.file ? req.file.filename : null;

            await OculosModelo.criar({
                nome: req.body.nome,
                descricao: req.body.descricao,
                categoria: req.body.categoria,
                cor: req.body.cor,
                tamanho: req.body.tamanho,
                preco: req.body.preco,
                estoque: req.body.estoque,
                imagem
            });

            await LogModelo.registrar(
                `Óculos criado: ${req.body.nome}`
            );

            return res.redirect('/oculos');
        } catch (erro) {
            console.error(erro);
            return res.status(500).send('Erro ao cadastrar óculos');
        }
    },

    async editar(req, res) {
        try {
            const oculos = await OculosModelo.buscarPorId(req.params.id);

            if (!oculos) {
                return res.status(404).send('Óculos não encontrado');
            }

            return res.render('oculos/editar', { oculos });
        } catch (erro) {
            console.error(erro);
            return res.status(500).send('Erro ao carregar o óculos');
        }
    },

    async atualizar(req, res) {
        try {
            const existente = await OculosModelo.buscarPorId(req.params.id);

            if (!existente) {
                return res.status(404).send('Óculos não encontrado');
            }

            const imagem = req.file
                ? req.file.filename
                : existente.imagem;

            await OculosModelo.atualizar(req.params.id, {
                ...req.body,
                imagem
            });

            await LogModelo.registrar(
                `Óculos atualizado: ${req.body.nome}`
            );

            return res.redirect('/oculos');
        } catch (erro) {
            console.error(erro);
            return res.status(500).send('Erro ao atualizar o óculos');
        }
    },

    async excluir(req, res) {
        try {
            const oculos = await OculosModelo.buscarPorId(req.params.id);

            await OculosModelo.remover(req.params.id);

            await LogModelo.registrar(
                `Óculos removido: ${oculos?.nome || req.params.id}`
            );

            return res.redirect('/oculos/admin');
        } catch (erro) {
            console.error(erro);

            if (erro.message === 'OCULOS_VINCULADO') {
                return res.send(`
                    <script>
                        alert('Este óculos possui pedidos vinculados e não pode ser excluído.');
                        window.location.href = '/oculos/admin';
                    </script>
                `);
            }

            return res.send(`
                <script>
                    alert('Erro ao excluir o óculos.');
                    window.location.href = '/oculos/admin';
                </script>
            `);
        }
    },

    async produto(req, res) {
        try {
            const oculos = await OculosModelo.buscarPorId(req.params.id);

            if (!oculos) {
                return res.status(404).send('Produto não encontrado');
            }

            const todosOculos = await OculosModelo.listar();

            const recomendacoes = todosOculos
                .filter(item => String(item.id) !== String(oculos.id))
                .slice(0, 3);

            return res.render('oculos/produto', {
                oculos,
                recomendacoes
            });
        } catch (erro) {
            console.error(erro);
            return res.status(500).send('Erro ao carregar o produto');
        }
    },

    async admin(req, res) {
        try {
            const oculos = await OculosModelo.listar();

            return res.render('oculos/admin', { oculos });
        } catch (erro) {
            console.error(erro);
            return res.status(500).send('Erro ao carregar o painel de óculos');
        }
    }
};

export default oculosControle;
