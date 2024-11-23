const controller_estadisticas = require('../controllers/estadisticas_controller');
const express = require('express');
const router = express.Router();


router.get('/reportes', controller_estadisticas.obtenerReportes);
router.get('/reportes/promedio-diarios', controller_estadisticas.obtenerPromedioReportesDiarios);
router.get('/reportes/total-tipo-reportes', controller_estadisticas.obtenerGraficaReportes);


router.get("/", controller_estadisticas.obtenerDatosEstadisticas);
module.exports = router;
