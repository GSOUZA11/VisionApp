class compraControle {

    async index(req, res) {

        const produtos = [
            {
                id: 1,
                nome: "Óculos Vision Pro",
                descricao: "Design sofisticado e materiais premium",
                preco: 990,
                precoOriginal: 1200,
                imagem: "/img/oculos3.png"
            },
            {
                id: 2,
                nome: "Dourado Precision Vision",
                descricao: "Elegância clássica com toque moderno",
                preco: 249,
                imagem: "/img/oculos classico 1.png"
            },
            {
                id: 3,
                nome: "RetroLite Fusio",
                descricao: "Sofisticação em cada detalhe",
                preco: 299,
                imagem: "/img/oculos classico 2.png"
            },
            {
                id: 4,
                nome: "BlackFrame Vintage",
                descricao: "O auge do refinamento",
                preco: 349,
                imagem: "/img/oculos classico 3.png"
            }
        ];

        const avaliacoes = [
            {
                nome: "Maria Santos",
                data: "15 de novembro, 2024",
                texto: "Simplesmente perfeito! Qualidade excelente.",
                produto: "Óculos Solar Clássico Premium",
                estrelas: 5,
                foto: "/img/cliente1.png"
            },
            {
                nome: "João Silva",
                data: "08 de novembro, 2024",
                texto: "Já é minha terceira compra e continuo impressionado.",
                produto: "Óculos de Grau Moderno Eco",
                estrelas: 5,
                foto: "/img/cliente2.png"
            },
            {
                nome: "Roberto Lima",
                data: "18 de outubro, 2024",
                texto: "Muito bom, só demorou um pouco a entrega.",
                produto: "Óculos de Grau Esportivo Tech",
                estrelas: 4,
                foto: "/img/cliente6.png"
            }
        ];

        res.render("compra/index", {
            titulo: "Compra",
            produtos,
            avaliacoes
        });
    }
}

export default new compraControle();