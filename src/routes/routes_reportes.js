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
router.get('/:id', reportesController.getReportePorId);




router.patch('/:id/espera', reportesController.ponerEnEsperaReporte);

router.patch('/:id/aprobar', reportesController.aprobarReporte);

router.get('/:id/detalles', reportesController.getDetallesReporte);



module.exports = router;