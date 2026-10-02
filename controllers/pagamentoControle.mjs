import carrinhoModelo from '../models/carrinhoModelo.mjs'
import pagamentoModelo from '../models/pagamentoModelo.mjs'

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        'pt-BR',
        {
            style: 'currency',
            currency: 'BRL'
        }
    )

}

class PagamentoControle {

    async index(req, res) {

        try {

            const produtos =
                await carrinhoModelo.listar()

            if (!produtos || produtos.length === 0) {

                return res.redirect('/carrinho')

            }

            const subtotal =
                produtos.reduce(
                    (total, item) =>
                        total + item.preco * item.quantidade,
                    0
                )

            const frete = 0

            const total =
                subtotal + frete

            const parcelas =
                Array.from(
                    { length: 6 },
                    (_, indice) => {

                        const numero =
                            indice + 1

                        return {
                            numero,
                            valor: total / numero,
                            valorFormatado:
                                formatarMoeda(total / numero)
                        }

                    }
                )

            const codigoBoleto =
                '23790001266000000000123456789012199900000099000'

            const codigoPix =
                '00020126580014br.gov.bcb.pix0136a1b2c3d4-e5f6-7890-abcd-ef1234567890520400005303986540599.005802BR5925LOJA ONLINE OCULOS SA6014SAO PAULO62070503***63041D3A'

            const barrasBoleto =
                [
                    3, 2, 4, 2, 3, 5, 2, 3, 2, 4,
                    3, 2, 5, 2, 3, 4, 2, 3, 2, 4,
                    3, 2, 5, 2, 3, 4, 2, 3, 5, 2,
                    4, 3, 2, 3, 4, 2, 5, 3, 2, 4
                ]

            res.render(
                'pagamento/index',
                {
                    titulo: 'Pagamento',
                    produtos,
                    subtotal,
                    frete,
                    total,
                    parcelas,
                    codigoBoleto,
                    codigoPix,
                    barrasBoleto,
                    formatarMoeda
                }
            )

        } catch (erro) {

            console.error(erro)

            res.status(500).render('erro', {
                mensagem: 'Erro ao carregar página de pagamento.',
                erro
            })

        }

    }

    async finalizar(req, res) {

        try {

            const produtos =
                await carrinhoModelo.listar()

            if (!produtos || produtos.length === 0) {

                return res.redirect('/carrinho')

            }

            const subtotal =
                produtos.reduce(
                    (total, item) =>
                        total + item.preco * item.quantidade,
                    0
                )

            const frete = 0

            const total =
                subtotal + frete

            const metodo =
                req.body.metodo || 'cartao'

            const parcelas =
                Number(req.body.parcelas || 1)

            const codigo_referencia =
                metodo === 'pix'
                    ? 'PIX-' + Date.now()
                    : metodo === 'boleto'
                        ? 'BOL-' + Date.now()
                        : 'CARD-' + Date.now()

            await pagamentoModelo.finalizar(
                {
                    cliente_id: 1,
                    produtos,
                    subtotal,
                    frete,
                    total,
                    metodo,
                    parcelas,
                    codigo_referencia
                }
            )

            res.redirect('/')

        } catch (erro) {

            console.error(erro)

            res.status(500).render(
                'erro',
                {
                    mensagem:
                        'Erro ao finalizar pagamento.'
                }
            )

        }

    }

}

export default new PagamentoControle()