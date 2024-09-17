const express = require('express');
const {
  obtenerComentarios,
  obtenerComentarioPorId,
  crearComentario,
  eliminarComentario
} = require('../controllers/comentarios_controllers');

const router = express.Router();

// Rutas para comentarios
router.get('/', obtenerComentarios); // Obtener todos los comentarios
router.get('/:id', obtenerComentarioPorId); // Obtener un comentario por ID
router.post('/', crearComentario);   // Crear un nuevo comentario
router.delete('/:id', eliminarComentario); // Eliminar un comentario por ID

module.exports = router;
