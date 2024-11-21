const controller_estadisticas = require('../controllers/estadisticas_controller');
const express = require('express');
const router = express.Router();


router.get('/reportes', controller_estadisticas.obtenerReportes);



module.exports = router;
