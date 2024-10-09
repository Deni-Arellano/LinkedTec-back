const express = require('express');
const router = express.Router();
const noticiasController = require('../controllers/noticias_controller.js');


/**
 * Ruta para crar noticias
 */

router.post('/', noticiasController.createNoticia);








module.exports = router;