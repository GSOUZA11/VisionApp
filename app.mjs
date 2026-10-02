import express from "express";
import session from "express-session";
import expressLayouts from "express-ejs-layouts";
import crypto from "node:crypto";
import fs from "node:fs";
import autenticacaoRotas from "./routes/autenticacao.mjs";
import funcionarioRotas from "./routes/funcionario.mjs";
import clienteRotas from "./routes/cliente.mjs";
import pedidoRotas from "./routes/pedido.mjs";
import oculosRotas from "./routes/oculos.mjs";
import cadastroRotas from "./routes/cadastro.mjs";
import contatoRotas from "./routes/contato.mjs";
import esqueceuSenhaRotas from "./routes/esqueceu_senha.mjs";
import sobreRotas from "./routes/sobre.mjs";
import compraRotas from "./routes/compra.mjs";
import entregaRotas from './routes/entrega.mjs';
import pagamentoRotas from "./routes/pagamento.mjs";
import politicaRotas from "./routes/politica.mjs";
import politicaEntregaRotas from "./routes/politicaEntrega.mjs";
import suporteRotas from './routes/suporte.mjs'
import dashboardRotas from "./routes/dashboard.mjs";
import configuracaoRotas from "./routes/configuracao.mjs";
import { inicializarBanco } from "./models/inicializador.mjs";
import { criarAdmin } from "./models/seed.mjs";
import { tratarErro } from "./middleware/erro.mjs";
import { flash } from "./middleware/flash.mjs";
import { garantirAutenticacao } from "./middleware/autenticacao.mjs";
import homeRotas from "./routes/home.mjs";
import carrinhoRotas from "./routes/carrinho.mjs";
import politicaEntregaRota from './routes/politicaEntrega.mjs'
import termosRotas from './routes/termos_e_condicoes.mjs'
import apiRouter from "./routes/apiRouter.mjs";

const app = express();

const PORTA = process.env.PORT || 3000;

const SEGREDO =
  process.env.SESSAO_SEGREDO ||
  crypto.randomBytes(32).toString("hex");

// ====================================
// EJS + LAYOUTS
// ====================================

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(expressLayouts);

app.set("layout", "layouts/layout");




// ====================================
// SESSÃO
// ====================================

app.use(
  session({
    secret: SEGREDO,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);


// ====================================
// MIDDLEWARES
// ====================================

app.use(flash);

app.use((req, res, next) => {

    res.locals.usuario =
        req.session?.usuario || null

    res.locals.title =
        'Vision'

    res.locals.pagina =
        ''

    next()

})

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(express.static("./public"));

// ====================================
// HOME
// ====================================

app.use('/', homeRotas)


// ====================================
// ROTAS
// ====================================
app.use('/politica-de-entrega', politicaEntregaRota)


app.use("/autenticacao", autenticacaoRotas);

app.use("/dashboard",
  garantirAutenticacao,
  dashboardRotas
);

app.use("/configuracao", configuracaoRotas);

app.use("/", homeRotas);

app.use("/funcionarios", funcionarioRotas);

app.use("/clientes", clienteRotas);

app.use("/pedido", pedidoRotas);

app.use("/oculos", oculosRotas);

app.use("/cadastro", cadastroRotas);

app.use("/contato", contatoRotas);

app.use("/esqueceu_senha", esqueceuSenhaRotas);

app.use("/sobre_nos", sobreRotas);

app.use("/compra", compraRotas);

app.use("/entrega", entregaRotas);

app.use("/pagamento", pagamentoRotas);

app.use("/politica", politicaRotas);

app.use("/carrinho", carrinhoRotas);

app.use(
  "/politica_entrega",
  politicaEntregaRotas
);

app.use(
  "/suporte",
  suporteRotas
);
app.use('/termos', termosRotas)

app.use("/api", apiRouter); 


// ====================================
// HOME
// ====================================

app.get("/", (req, res) => {
  res.render("home/index", {
    titulo: "Vision",
    pagina: "home"
  });
});


// ====================================
// BANCO
// ====================================

try {
  await inicializarBanco();
  await criarAdmin();
} catch (erro) {
  console.error(erro);
}


// ====================================
// UPLOADS
// ====================================

if (!fs.existsSync("./public/uploads")) {
  fs.mkdirSync("./public/uploads", {
    recursive: true,
  });
}


// ====================================
// ERROS
// ====================================

app.use(tratarErro);


// ====================================
// SERVIDOR
// ====================================

app.listen(PORTA, () => {
  console.log(
    `Servidor iniciado na porta http://127.0.0.1:${PORTA}`
  );
});