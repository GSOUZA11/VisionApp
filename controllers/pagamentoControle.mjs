
import carrinhoModelo from '../models/carrinhoModelo.mjs';
import pagamentoModelo from '../models/pagamentoModelo.mjs';

function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

class PagamentoControle {
    async index(req, res) {
        try {
            const usuario = req.session?.usuario;

            if (!usuario) {
                return res.redirect('/autenticacao/login');
            }

            const clienteId = Number(usuario.id);

            if (!Number.isInteger(clienteId) || clienteId <= 0) {
                return res.status(400).send('ID do cliente inválido.');
            }

            const entrega = req.session.entrega;

            // A entrega precisa ser preenchida antes do pagamento.
            if (!entrega || Number(entrega.cliente_id) !== clienteId) {
                return res.redirect('/entrega');
            }

            const produtos = await carrinhoModelo.listar(clienteId);

            if (!produtos || produtos.length === 0) {
                return res.redirect('/carrinho');
            }

            const subtotal = produtos.reduce(
                (total, item) =>
                    total + Number(item.preco) * Number(item.quantidade),
                0
            );

            const frete = subtotal >= 300 ? 0 : 25;
            const total = subtotal + frete;

            // Mantém os valores atualizados na sessão de entrega.
            req.session.entrega.subtotal = subtotal;
            req.session.entrega.frete = frete;
            req.session.entrega.total = total;

            const parcelas = Array.from({ length: 6 }, (_, indice) => {
                const numero = indice + 1;
                const valor = total / numero;

                return {
                    numero,
                    valor,
                    valorFormatado: formatarMoeda(valor)
                };
            });

            const codigoBoleto =
                '23790001266000000000123456789012199900000099000';

            const codigoPix =
                '00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540599.005802BR5925LOJA ONLINE OCULOS SA6014SAO PAULO62070503***63041D3A';

            const barrasBoleto = [
                3, 2, 4, 2, 3, 5, 2, 3, 2, 4,
                3, 2, 5, 2, 3, 4, 2, 3, 2, 4,
                3, 2, 5, 2, 3, 4, 2, 3, 5, 2,
                4, 3, 2, 3, 4, 2, 5, 3, 2, 4
            ];

            return res.render('pagamento/index', {
                titulo: 'Pagamento',
                produtos,
                subtotal,
                frete,
                total,
                parcelas,
                codigoBoleto,
                codigoPix,
                barrasBoleto,
                formatarMoeda,
                entrega
            });
        } catch (erro) {
            console.error('Erro ao carregar página de pagamento:', erro);

            return res.status(500).render('erro', {
                mensagem: 'Erro ao carregar página de pagamento.'
            });
        }
    }

    async finalizar(req, res) {
        try {
            const usuario = req.session?.usuario;

            if (!usuario) {
                return res.redirect('/autenticacao/login');
            }

            const clienteId = Number(usuario.id);
            const entrega = req.session.entrega;

            if (!Number.isInteger(clienteId) || clienteId <= 0) {
                return res.status(400).send('ID do cliente inválido.');
            }

            if (!entrega || Number(entrega.cliente_id) !== clienteId) {
                return res.redirect('/entrega');
            }

            const produtos = await carrinhoModelo.listar(clienteId);

            if (!produtos || produtos.length === 0) {
                return res.redirect('/carrinho');
            }

            const subtotal = produtos.reduce(
                (total, item) =>
                    total + Number(item.preco) * Number(item.quantidade),
                0
            );

            const frete = subtotal >= 300 ? 0 : 25;
            const total = subtotal + frete;

            const metodo = req.body.metodo || 'cartao';
            const parcelas = Number(req.body.parcelas || 1);

            const metodosPermitidos = ['cartao', 'pix', 'boleto'];

            if (!metodosPermitidos.includes(metodo)) {
                return res.status(400).send('Método de pagamento inválido.');
            }

            if (
                !Number.isInteger(parcelas) ||
                parcelas < 1 ||
                parcelas > 6
            ) {
                return res.status(400).send('Quantidade de parcelas inválida.');
            }

            const codigo_referencia =
                `${metodo.toUpperCase()}-${Date.now()}`;

            const pedidoId = await pagamentoModelo.finalizar({
                cliente_id: clienteId,
                produtos,
                subtotal,
                frete,
                total,
                metodo,
                parcelas: metodo === 'cartao' ? parcelas : 1,
                codigo_referencia
            });

            // Guarda os dados para exibir a confirmação após limpar o carrinho.
            req.session.confirmacaoCompra = {
                pedidoId,
                entrega: { ...entrega },
                subtotal,
                frete,
                total,
                metodo,
                parcelas: metodo === 'cartao' ? parcelas : 1,
                codigo_referencia,
                produtos: produtos.map(item => ({ ...item }))
            };

            delete req.session.entrega;

            return res.redirect('/pagamento/confirmacao');
        } catch (erro) {
            console.error('Erro ao finalizar pagamento:', erro);

            return res.status(500).render('erro', {
                mensagem: 'Erro ao finalizar pagamento. Verifique os dados e tente novamente.'
            });
        }
    }

    async confirmacao(req, res) {
        const confirmacao = req.session?.confirmacaoCompra;

        if (!confirmacao) {
            return res.redirect('/carrinho');
        }

        return res.render('pagamento/confirmacao', {
            titulo: 'Compra confirmada',
            confirmacao,
            formatarMoeda
        });
    }
}

export default new PagamentoControle();
