import express from 'express'
import controle from '../controllers/esqueceu_senhaControle.mjs'
const rota=express.Router()
rota.get('/',controle.index)
rota.get('/novo',controle.novoFormulario)
rota.get('/:id',controle.mostrar)
rota.get('/:id/editar',controle.editarFormulario)
export default rota
