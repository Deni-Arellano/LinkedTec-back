const express = require('express');
const { crearPublicacion, obtenerPublicacionPorId, obtenerTodasLasPublicaciones, obtenerPublicacionesPorUsuario } = require('../controllers/controller_publicaciones');

const router = express.Router();

router.post('/', crearPublicacion);
router.get('/usuario/:id_usuario', obtenerPublicacionesPorUsuario);
router.get('/id/:id_publicacion', obtenerPublicacionPorId);
router.get('/', obtenerTodasLasPublicaciones);

module.exports = router;
