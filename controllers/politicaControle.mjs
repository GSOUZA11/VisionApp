class PoliticaControle {

    async index(req, res) {
        res.render("politica/index", {
            titulo: "Política de Privacidade"
        });
    }

}

export default new PoliticaControle();