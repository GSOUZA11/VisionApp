
import ClienteModelo from '../models/clienteModelo.mjs';
import PedidoModelo from '../models/PedidoModelo.mjs';

const clienteControle = {
    async index(req, res) {
        try {
            const usuarioSessao = req.session?.usuario;

            if (!usuarioSessao) {
                return res.redirect('/autenticacao');
            }

            const cliente = await ClienteModelo.buscarPorId(
                Number(usuarioSessao.id)
            );

            if (!cliente) {
                return res.status(404).render('erro', {
                    mensagem: 'Não foi possível localizar sua conta.'
                });
            }

            const usuario = {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email,
                telefone: cliente.telefone
            };

            // Garante que a área de pedidos tenha o ID do cliente.
            req.session.usuario.clienteID = cliente.id;

            // Busca somente os pedidos deste cliente.
            const pedidos = await PedidoModelo.listarPorCliente(
                cliente.id
            );

            const resumo = {
                quantidadePedidos: pedidos.length,
                valorTotal: pedidos.reduce((total, pedido) => {
                    return total + (Number(pedido.total) || 0);
                }, 0)
            };

            return res.render('clientes/index', {
                titulo: 'Minha conta',
                pagina: 'conta',
                usuario,
                resumo
            });
        } catch (erro) {
            console.error('Erro ao carregar minha conta:', erro);

            return res.status(500).render('erro', {
                mensagem: 'Erro ao carregar os dados da sua conta.'
            });
        }
    },

    async editarFormulario(req, res) {
        try {
            const usuarioSessao = req.session?.usuario;

            if (!usuarioSessao) {
                return res.redirect('/autenticacao');
            }

            const cliente = await ClienteModelo.buscarPorId(
                Number(usuarioSessao.id)
            );

            if (!cliente) {
                return res.status(404).render('erro', {
                    mensagem: 'Cliente não encontrado.'
                });
            }

            const usuario = {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email,
                telefone: cliente.telefone
            };

            return res.render('clientes/editar', {
                titulo: 'Editar minha conta',
                pagina: 'conta',
                usuario,
                cliente: usuario,
                erro: null
            });
        } catch (erro) {
            console.error('Erro ao carregar formulário:', erro);

            return res.status(500).render('erro', {
                mensagem: 'Erro ao carregar o formulário de edição.'
            });
        }
    },

    async atualizar(req, res) {
        try {
            const usuarioSessao = req.session?.usuario;

            if (!usuarioSessao) {
                return res.redirect('/autenticacao');
            }

            const id = Number(usuarioSessao.id);
            const nome = req.body.nome?.trim();
            const telefone = req.body.telefone?.trim() || '';

            // Se o formulário não enviar e-mail, preserva o atual.
            const clienteAtual = await ClienteModelo.buscarPorId(id);
            const email = req.body.email?.trim() || clienteAtual?.email;

            if (!nome || !email) {
                return res.status(400).send(
                    'Nome e e-mail são obrigatórios.'
                );
            }

            await ClienteModelo.atualizar(
                id,
                nome,
                telefone,
                email
            );

            req.session.usuario.nome = nome;
            req.session.usuario.email = email;

            return res.redirect('/clientes');
        } catch (erro) {
            console.error('Erro ao atualizar minha conta:', erro);

            return res.status(500).render('erro', {
                mensagem: 'Erro ao atualizar os dados da sua conta.'
            });
        }
    },

    async novo(req, res) {
        return res.status(403).send(
            'O cadastro de clientes deve ser realizado pela área apropriada.'
        );
    },

    async criar(req, res) {
        return res.status(403).send(
            'Você não tem permissão para cadastrar clientes por esta rota.'
        );
    },

    async remover(req, res) {
        return res.status(403).send(
            'Você não tem permissão para excluir clientes por esta rota.'
        );
    }
};

export default clienteControle;
