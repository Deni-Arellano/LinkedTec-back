const express = require('express');
const router = express.Router();
const noticiasController = require('../controllers/noticias_controller.js');



/**
 * Ruta para crar noticias
 */

router.post('/', noticiasController.createNoticia);


router.delete('/:id_noticia', noticiasController.eliminarNoticia);


router.patch('/:id_noticia', noticiasController.actualizarNoticia);

router.get('/:id', noticiasController.obtenerNoticiaPorId);



module.exports = router;