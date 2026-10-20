
import express from "express";
import carrinhoControle from "../controllers/carrinhoControle.mjs";

const rota = express.Router();

// Exibir o carrinho
rota.get("/", carrinhoControle.index);

// Adicionar produto ao carrinho
rota.post("/adicionar/:id", carrinhoControle.adicionar);

// Alterar quantidade
rota.get("/mais/:id", carrinhoControle.aumentar);
rota.get("/menos/:id", carrinhoControle.diminuir);

// Remover produto
rota.get("/remover/:id", carrinhoControle.remover);

export default rota;
