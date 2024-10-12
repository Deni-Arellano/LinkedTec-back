const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventos_controller');



router.post('/', eventosController.crearEvento);




module.exports = router;

