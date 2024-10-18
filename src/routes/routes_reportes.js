const express = require('express');
const reportesController = require('../controllers/reportes_controller');

const router = express.Router();

// Ruta para crear un nuevo reporte
router.post('/', reportesController.createReporte);
//http://localhost:3000/reportes





/**
 * Ruta para obtener todos los reportes
 */
router.get('/', reportesController.getReportes);

/**
 * Ruta para obtener un reporte por ID
 */
router.get('/:id', reportesController.getReporteById);






module.exports = router;