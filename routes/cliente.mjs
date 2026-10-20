import express from 'express';
import clienteControle
    from '../controllers/clienteControle.mjs';

import {
    garantirAutenticacao
} from '../middleware/autenticacao.mjs';

const rota = express.Router();

// Todas as rotas exigem autenticação.
rota.use(garantirAutenticacao);

// Área pessoal do cliente.
rota.get(
    '/',
    clienteControle.index
);

// Edição dos próprios dados.
rota.get(
    '/editar',
    clienteControle.editarFormulario
);

rota.post(
    '/editar',
    clienteControle.atualizar
);

// Rotas administrativas antigas, mantidas por enquanto.
rota.get(
    '/novo',
    clienteControle.novo
);

rota.post(
    '/novo',
    clienteControle.criar
);

rota.get(
    '/:id/editar',
    clienteControle.editarFormulario
);

rota.post(
    '/:id/editar',
    clienteControle.atualizar
);

rota.post(
    '/:id/excluir',
    clienteControle.remover
);

export default rota;