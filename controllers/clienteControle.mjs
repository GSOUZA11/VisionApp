
import ClienteModelo from '../models/clienteModelo.mjs';

const clienteControle = {
    // Exibe a área pessoal do cliente autenticado.
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

            // Não envia a senha para a página.
            const usuario = {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email,
                telefone: cliente.telefone
            };

            return res.render('clientes/index', {
                titulo: 'Minha conta',
                pagina: 'conta',
                usuario
            });
        } catch (erro) {
            console.error('Erro ao carregar minha conta:', erro);

            return res.status(500).render('erro', {
                mensagem: 'Erro ao carregar os dados da sua conta.'
            });
        }
    },

    // Abre o formulário para editar os próprios dados.
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

    // Atualiza somente a conta do usuário autenticado.
    async atualizar(req, res) {
        try {
            const usuarioSessao = req.session?.usuario;

            if (!usuarioSessao) {
                return res.redirect('/autenticacao');
            }

            const id = Number(usuarioSessao.id);
            const { nome, telefone, email } = req.body;

            if (!nome?.trim() || !email?.trim()) {
                return res.status(400).send(
                    'Nome e e-mail são obrigatórios.'
                );
            }

            await ClienteModelo.atualizar(
                id,
                nome.trim(),
                telefone?.trim() || '',
                email.trim()
            );

            // Mantém os dados da sessão atualizados.
            req.session.usuario.nome = nome.trim();
            req.session.usuario.email = email.trim();

            return res.redirect('/clientes');
        } catch (erro) {
            console.error('Erro ao atualizar minha conta:', erro);

            return res.status(500).render('erro', {
                mensagem: 'Erro ao atualizar os dados da sua conta.'
            });
        }
    },

    // As operações administrativas não são disponibilizadas
    // pela área pessoal do cliente.
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
