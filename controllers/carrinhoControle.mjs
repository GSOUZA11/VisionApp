import CarrinhoModelo from "../models/carrinhoModelo.mjs";

class CarrinhoControle {

    async index(req,res){

        const carrinho = await CarrinhoModelo.listar();

        let subtotal = 0;

        carrinho.forEach(item=>{

            subtotal += item.preco * item.quantidade;

        });

        const frete = subtotal >= 300 ? 0 : 25;

        const total = subtotal + frete;

        res.render("carrinho/index",{

            carrinho,
            subtotal,
            frete,
            total

        });

    }

    async aumentar(req,res){

        await CarrinhoModelo.aumentar(req.params.id);

        res.redirect("/carrinho");

    }

    async diminuir(req,res){

        await CarrinhoModelo.diminuir(req.params.id);

        res.redirect("/carrinho");

    }

    async remover(req,res){

        await CarrinhoModelo.remover(req.params.id);

        res.redirect("/carrinho");

    }

}

export default new CarrinhoControle();