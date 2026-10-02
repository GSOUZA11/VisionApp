import express from "express";
import termosControle from "../controllers/termos_e_condicoesControle.mjs";

const router = express.Router();

router.get("/", termosControle.index);

export default router;