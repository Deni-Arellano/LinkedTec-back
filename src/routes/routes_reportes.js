const express = require('express');
const reportesController = require('../controllers/reportes_controller');

const router = express.Router();

// Ruta para crear un nuevo reporte
router.post('/', reportesController.createReporte);

module.exports = router;
