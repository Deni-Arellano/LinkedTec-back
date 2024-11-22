// routes/seguimiento_routes.js

const express = require('express');
const { gestionarSeguimiento } = require('../controllers/seguidores_controller');

const router = express.Router();

router.post('/', gestionarSeguimiento);

module.exports = router;
