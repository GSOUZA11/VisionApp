import { Router } from "express";
import politicaControle from "../controllers/politicaControle.mjs";

const router = Router();

router.get("/", (req, res) => {
    politicaControle.index(req, res);
});

export default router;