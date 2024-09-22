const express = require('express');
const {
  obtenerComentarios,
  crearComentario,
  eliminarComentario
} = require('../controllers/comentarios_controllers');

const router = express.Router();

// Define las rutas para comentarios
router.get('/', obtenerComentarios); // Obtener todos los comentarios
router.post('/:id', crearComentario);   // Crear un nuevo comentario
router.delete('/:id', eliminarComentario); // Eliminar un comentario por ID

module.exports = router;
