const {
  crearPublicacionService,
  obtenerTodasLasPublicacionesService,
  obtenerPublicacionesPorUsuarioService,
  obtenerPublicacionPorIdService
} = require('../services/services_publicaciones'); // Importa los servicios correspondientes

/**
 * Crea una nueva publicación.
 * @param {Object} req - El objeto de la solicitud HTTP.
 * @param {Object} res - El objeto de la respuesta HTTP.
 * @returns {Promise<void>} - Responde con la nueva publicación o un error.
 */
const crearPublicacion = async (req, res) => {
  try {
    const nuevaPublicacion = await crearPublicacionService(req.body); // Llama al servicio para crear la publicación
    res.status(201).json(nuevaPublicacion); // Responde con la nueva publicación
  } catch (error) {
    console.error(error); // Registra el error en la consola
    res.status(500).json({ mensaje: 'Error al crear la publicación' }); // Responde con un mensaje de error
  }
};

/**
 * Obtiene todas las publicaciones de un usuario específico.
 * @param {Object} req - El objeto de la solicitud HTTP.
 * @param {Object} res - El objeto de la respuesta HTTP.
 * @returns {Promise<void>} - Responde con las publicaciones del usuario o un error.
 */
const obtenerPublicacionesPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params; // Extrae el ID del usuario de los parámetros
    const publicaciones = await obtenerPublicacionesPorUsuarioService(id_usuario); // Llama al servicio para obtener las publicaciones
    res.status(200).json(publicaciones); // Responde con las publicaciones
  } catch (error) {
    console.error(error); // Registra el error en la consola
    res.status(500).json({ mensaje: 'Error al obtener las publicaciones del usuario' }); // Responde con un mensaje de error
  }
};

/**
 * Obtiene una publicación específica por su ID.
 * @param {Object} req - El objeto de la solicitud HTTP.
 * @param {Object} res - El objeto de la respuesta HTTP.
 * @returns {Promise<void>} - Responde con la publicación o un error.
 */
const obtenerPublicacionPorId = async (req, res) => {
  try {
    const { id_publicacion } = req.params; // Extrae el ID de la publicación de los parámetros
    const publicacion = await obtenerPublicacionPorIdService(id_publicacion); // Llama al servicio para obtener la publicación
    res.status(200).json(publicacion); // Responde con la publicación
  } catch (error) {
    console.error(error); // Registra el error en la consola
    res.status(500).json({ mensaje: 'Error al obtener la publicación' }); // Responde con un mensaje de error
  }
};

/**
 * Obtiene todas las publicaciones.
 * @param {Object} req - El objeto de la solicitud HTTP.
 * @param {Object} res - El objeto de la respuesta HTTP.
 * @returns {Promise<void>} - Responde con todas las publicaciones o un error.
 */
const obtenerTodasLasPublicaciones = async (req, res) => {
  try {
    const publicaciones = await obtenerTodasLasPublicacionesService(); // Llama al servicio para obtener todas las publicaciones
    res.status(200).json(publicaciones); // Responde con las publicaciones
  } catch (error) {
    console.error(error); // Registra el error en la consola
    res.status(500).json({ mensaje: 'Error al obtener las publicaciones' }); // Responde con un mensaje de error
  }
};

// Exporta las funciones para usarlas en otras partes de la aplicación
module.exports = {
  crearPublicacion,
  obtenerPublicacionesPorUsuario,
  obtenerPublicacionPorId,
  obtenerTodasLasPublicaciones
};
