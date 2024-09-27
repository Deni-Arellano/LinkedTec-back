const Publicacion = require('../models/publicaciones'); 
const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Función para crear una nueva publicación.
 * @param {Object} datosPublicacion - Datos de la publicación a crear.
 * @returns {Promise<Object>} La nueva publicación creada.
 */
const crearPublicacionService = async (datosPublicacion) => {
  const { descripcion, imagen, id_usuario } = datosPublicacion; // Desestructura los datos de la publicación

  // Crea una nueva publicación en la base de datos
  const nuevaPublicacion = await Publicacion.create({
    descripcion,
    imagen,
    fecha: new Date(), // Establece la fecha actual
    id_usuario,
    me_gusta: 0, // Inicializa me_gusta en 0
    disgusta: 0 // Inicializa disgusta en 0
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

/**
 * Función para actualizar completamente una publicación (PUT).
 * @param {number} id_publicacion - ID de la publicación a actualizar.
 * @param {Object} datosPublicacion - Nuevos datos completos de la publicación.
 * @returns {Promise<Object|null>} La publicación actualizada o null si no existe.
 */
const actualizarPublicacionCompletaService = async (id_publicacion, datosPublicacion) => {
  try {

    const publicacion = await Publicacion.findByPk(id_publicacion);

    if (!publicacion) {
      console.log('Publicación no encontrada');
      return null;
    }

    
    const { descripcion, imagen, id_usuario } = datosPublicacion;

    if (!descripcion || !imagen || !id_usuario) {
      throw new Error('Todos los campos son requeridos para una actualización completa');
    }

    const query = `
      UPDATE publicaciones
      SET descripcion = :descripcion,
          imagen = :imagen,
          id_usuario = :id_usuario,
          fecha = NOW() 
      WHERE id_publicacion = :id_publicacion
    `;

    const [results, metadata] = await sequelize.query(query, {
      replacements: {
        descripcion,
        imagen,
        id_usuario,
        id_publicacion
      }
    });

    
    if (metadata.rowCount === 0) {
      return null;
    }

    // Retorna la publicación actualizada (puedes volver a buscarla si necesitas los datos actualizados)
    return await Publicacion.findByPk(id_publicacion);

  } catch (error) {
    throw error;
  }
};


/**
 * Función para actualizar parcialmente una publicación (PATCH).
 * @param {number} id_publicacion - ID de la publicación a actualizar.
 * @param {Object} datosPublicacion - Datos parciales de la publicación a actualizar.
 * @returns {Promise<Object|null>} La publicación actualizada o null si no existe.
 */

const actualizarPublicacionParcialService = async (id_publicacion, datosPublicacion) => {
  try {

    const publicacion = await Publicacion.findByPk(id_publicacion);

    if (!publicacion) {
      console.log('Publicación no encontrada');
      return null;
    }

    
    const { descripcion, imagen } = datosPublicacion;

    if (!descripcion || !imagen) {
      throw new Error('Tanto la descripción como la imagen son requeridos para esta actualización');
    }

    const query = `
      UPDATE publicaciones
      SET descripcion = :descripcion,
          imagen = :imagen,
          fecha = NOW()
      WHERE id_publicacion = :id_publicacion
    `;

    const [results, metadata] = await sequelize.query(query, {
      replacements: {
        descripcion,
        imagen,
        id_publicacion
      }
    });

    
    if (metadata.rowCount === 0) {
      console.log('No se pudo actualizar la publicación');
      return null;
    }

    return await Publicacion.findByPk(id_publicacion);

  } catch (error) {
    console.error('Error al actualizar la publicación:', error);
    throw error;
  }
};

const eliminarPublicacionService = async (id_publicacion) => {
  try {
    const publicacion = await Publicacion.findByPk(id_publicacion);

    if (!publicacion) {
      console.log('Publicación no encontrada');
      return null;
    }

    await publicacion.destroy();

    console.log('Publicación eliminada exitosamente');
    return publicacion;


  } catch (error) {
    console.error('Error al eliminar la publicación:', error);
    throw error;
  }
};

// Exporta las funciones para que puedan ser utilizadas en otros módulos
module.exports = {
  crearPublicacionService,
  obtenerPublicacionesPorUsuarioService,
  obtenerPublicacionPorIdService,
  obtenerTodasLasPublicacionesService,
  actualizarPublicacionCompletaService,
  actualizarPublicacionParcialService,
  eliminarPublicacionService
};
