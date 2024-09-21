const express = require('express');
const router = express.Router();
const egresadosController = require('../controllers/egresados_controller');

// Obtener todos los egresados
router.get('/', egresadosController.getAllEgresados);

// Obtener la información de un egresado por ID
router.get('/perfil/:id', egresadosController.getEgresadoById);

// Crear un nuevo egresado
router.post('/', egresadosController.createEgresado);

module.exports = router;
