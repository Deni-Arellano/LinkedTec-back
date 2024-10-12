const express = require('express');
const router = express.Router();
const EventoController = require('../controllers/eventos_controller');


router.post('/', EventoController.crearEvento);
router.get('/', EventoController.obtenerEventos);
router.get('/:id', EventoController.obtenerEventoById);
router.delete('/:id', EventoController.eliminarEvento);
router.patch('/:id', EventoController.actualizarEvento);


module.exports = router;

