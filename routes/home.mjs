import express from "express";
import homeControle from "../controllers/homeControle.mjs";

const rota = express.Router();

rota.get("/", homeControle.index);

export default rota