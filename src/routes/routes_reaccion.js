// routes/reacciones_routes.js
const express = require('express');
const router = express.Router();
const reaccionarController  = require('../controllers/reaccion_controller');

// Ruta para reaccionar a una publicación
router.post('/reaccionar', reaccionarController.reaccionar);

module.exports = router;
