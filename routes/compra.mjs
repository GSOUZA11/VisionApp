import express from "express";
import compraControle from "../controllers/compraControle.mjs";

const router = express.Router();

router.get("/", compraControle.index);

export default router;