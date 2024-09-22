// src/routes/routes_egresados.js
const express = require('express');
const router = express.Router();
const egresadosController = require('../controllers/egresados_controller');

router.post('/egresados', egresadosController.createEgresado);
router.get('/egresados', egresadosController.getEgresados);

module.exports = router;