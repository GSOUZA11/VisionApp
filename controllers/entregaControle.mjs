/*import carrinhoModelo from '../models/carrinhoModelo.mjs';
import enderecoModelo from '../models/enderecoModelo.mjs';

class EntregaControle {

    async index(req, res) {

        try {

            const produtos = await carrinhoModelo.listar();

            const subtotal = produtos.reduce(
                (total, item) => total + (item.preco * item.quantidade),
                0
            );

            res.render('entrega/index', {
                titulo: 'Entrega',
                produtos,
                subtotal
            });

        } catch (erro) {

            console.error(erro);

            res.status(500).render('erro', {
                mensagem: 'Erro ao carregar página de entrega.'
            });

        }

    }

    async salvar(req, res) {

        try {

            await enderecoModelo.cadastrar({

                cliente_id: 1,

                ...req.body

            });

            res.redirect('/pagamento');

        }

        catch (erro) {

            console.error(erro);

            res.status(500).render('erro', {

                mensagem:
                    'Erro ao salvar endereço.'

            });

        }

    }

}

export default new EntregaControle();*/

class EntregaControle {

    async index(req, res) {

        const produtos = [
            {
                nome: 'Óculos de Grau Modelo Fashion',
                modelo: 'RB4340 601/87 45-23',
                imagem: 'oculos3.png',
                preco: 990,
                quantidade: 1
            }
        ]

        const subtotal = produtos.reduce(
            (total, item) => total + item.preco * item.quantidade,
            0
        )

        res.render('entrega/index', {
            titulo: 'Entrega',
            produtos,
            subtotal
        })

    }

    async salvar(req, res) {

        console.log('Dados de entrega recebidos:', req.body)

        res.redirect('/pagamento')

    }

}

export default new EntregaControle()