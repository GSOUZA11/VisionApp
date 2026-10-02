import express from "express";
import carrinhoControle from "../controllers/carrinhoControle.mjs";

const rota = express.Router();

rota.get("/", carrinhoControle.index);
rota.get("/mais/:id", carrinhoControle.aumentar);
rota.get("/menos/:id", carrinhoControle.diminuir);
rota.get("/remover/:id", carrinhoControle.remover);

export default rota;