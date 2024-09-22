const express = require('express');
const router = express.Router();
const egresadosController = require('../controllers/egresados_controller');

/**
 * Ruta para obtener todos los egresados
 */
router.get('/', egresadosController.getAllEgresados);

/**
 * Ruta para obtener la información de un egresado por ID
 */
router.get('/perfil/:id', egresadosController.getEgresadoById);

/**
 * Ruta para crear un nuevo egresado
 */
router.post('/', egresadosController.createEgresado);

module.exports = router;