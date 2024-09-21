const Publicacion = require('../models/publicaciones'); 

/**
 * Función para crear una nueva publicación.
 * @param {Object} datosPublicacion - Datos de la publicación a crear.
 * @returns {Promise<Object>} La nueva publicación creada.
 */
const crearPublicacionService = async (datosPublicacion) => {
  const { texto, imagen, id_usuario } = datosPublicacion; // Desestructura los datos de la publicación

  // Crea una nueva publicación en la base de datos
  const nuevaPublicacion = await Publicacion.create({
    texto,
    imagen,
    fecha: new Date(), // Establece la fecha actual
    id_usuario,
  });

  return nuevaPublicacion; // Devuelve la nueva publicación creada
};

/**
 * Función para obtener todas las publicaciones de un usuario específico.
 * @param {number} id_usuario - ID del usuario cuyas publicaciones se quieren obtener.
 * @returns {Promise<Array>} Lista de publicaciones del usuario.
 */
const obtenerPublicacionesPorUsuarioService = async (id_usuario) => {
  // Busca todas las publicaciones que pertenecen al usuario indicado
  const publicaciones = await Publicacion.findAll({
    where: { id_usuario }
  });
  return publicaciones; // Devuelve la lista de publicaciones
};

/**
 * Función para obtener una publicación específica por su ID.
 * @param {number} id_publicacion - ID de la publicación a obtener.
 * @returns {Promise<Object|null>} La publicación encontrada o null si no existe.
 */
const obtenerPublicacionPorIdService = async (id_publicacion) => {
  // Busca la publicación por su ID
  const publicacion = await Publicacion.findByPk(id_publicacion);
  return publicacion; // Devuelve la publicación encontrada o null
};

/**
 * Función para obtener todas las publicaciones.
 * @returns {Promise<Array>} Lista de todas las publicaciones.
 */
const obtenerTodasLasPublicacionesService = async () => {
  // Busca todas las publicaciones en la base de datos
  const publicaciones = await Publicacion.findAll();
  return publicaciones; // Devuelve la lista de todas las publicaciones
};

// Exporta las funciones para que puedan ser utilizadas en otros módulos
module.exports = {
  crearPublicacionService,
  obtenerPublicacionesPorUsuarioService,
  obtenerPublicacionPorIdService,
  obtenerTodasLasPublicacionesService
};
