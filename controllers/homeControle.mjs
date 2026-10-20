// controllers/homeControle.mjs

import OculosModelo from "../models/oculosModelo.mjs";

const homeControle = {
    async index(req, res) {
        const oculos = await OculosModelo.listar();

        res.render("home/index", {
            title: "Vision",
            pagina: "home",
            destaques: oculos.slice(0, 6)
        });
    }
};

export default homeControle;