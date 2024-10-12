const express = require('express');
const router = express.Router();
const EventoController = require('../controllers/eventos_controller');


router.post('/', EventoController.crearEvento);


module.exports = router;

