const express = require('express'); // Importa el módulo de Express
const {
  crearPublicacion,
  obtenerPublicacionPorId,
  obtenerTodasLasPublicaciones,
  obtenerPublicacionesPorUsuario
} = require('../controllers/controller_publicaciones'); // Importa los controladores de publicaciones

const router = express.Router(); // Crea un nuevo enrutador

/**
 * Ruta para crear una nueva publicación.
 * Se espera que el cliente envíe los datos de la publicación en el cuerpo de la solicitud.
 */
router.post('/', crearPublicacion); // Maneja las solicitudes POST para crear una publicación

/**
 * Ruta para obtener todas las publicaciones de un usuario específico.
 * Se espera que el ID del usuario se pase como un parámetro en la URL.
 */
router.get('/usuario/:id_usuario', obtenerPublicacionesPorUsuario); // Maneja las solicitudes GET para obtener publicaciones por usuario

/**
 * Ruta para obtener una publicación específica por su ID.
 * Se espera que el ID de la publicación se pase como un parámetro en la URL.
 */
router.get('/id/:id_publicacion', obtenerPublicacionPorId); // Maneja las solicitudes GET para obtener una publicación por ID

/**
 * Ruta para obtener todas las publicaciones.
 * Responde con un arreglo de todas las publicaciones existentes.
 */
router.get('/', obtenerTodasLasPublicaciones); // Maneja las solicitudes GET para obtener todas las publicaciones

// Exporta el enrutador para que pueda ser utilizado en otras partes de la aplicación
module.exports = router;
