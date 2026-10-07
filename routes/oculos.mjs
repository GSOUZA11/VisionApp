import express from 'express'
import multer from 'multer'
import path from 'path'
import {
    garantirAutenticacao,
    somenteAdministrador
} from '../middleware/autenticacao.mjs'
import OculosModelo from '../models/oculosModelo.mjs'
import oculosControle from '../controllers/oculosControle.mjs'


const rota = express.Router()

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(
            null,
            './public/uploads'
        )
    },

    filename(req, file, cb) {

        cb(
            null,
            Date.now() +
            '-' +
            file.originalname
        )
    }
})

const upload = multer({

    storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter(req, file, cb) {

        const permitido = [
            '.jpg',
            '.jpeg',
            '.png',
            '.webp'
        ]

        const extensao = path
            .extname(file.originalname)
            .toLowerCase()

        cb(
            null,
            permitido.includes(extensao)
        )
    }
})

// /oculos?tipo=esportivo  -> público (vitrine por tipo)
// /oculos                 -> listagem administrativa (exige login)
rota.get(
    '/',
    (req, res, next) => {

        if (req.query.tipo) {
            return oculosControle.tipo(req, res, next)
        }

        return garantirAutenticacao(
            req,
            res,
            () => oculosControle.index(req, res, next)
        )
    }
)

rota.get(
    '/completo',
    oculosControle.completo
)

rota.get(
    '/novo',
    somenteAdministrador,
    oculosControle.novo
)

rota.post(
    '/novo',
    somenteAdministrador,
    upload.single('imagem'),
    oculosControle.criar
)


rota.get(
    '/:id/editar',
    somenteAdministrador,
    oculosControle.editar
)


rota.post(
    '/:id/editar',
    somenteAdministrador,
    upload.single('imagem'),
    oculosControle.atualizar
)

rota.post(
    '/:id/excluir',
    somenteAdministrador,
    oculosControle.excluir
)

rota.get(
    '/buscar',
    async (req, res) => {

        const oculos =
            await OculosModelo.pesquisar(
                req.query.nome
            )

        res.render(
            'oculos/index',
            { oculos }
        )
    }
)


export default rota