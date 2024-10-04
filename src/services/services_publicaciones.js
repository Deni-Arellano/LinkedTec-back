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
  // Busca todas las publicaciones en la base de datos, ordenadas de más recientes a más antiguas
  const publicaciones = await Publicacion.findAll({
    order: [['fecha', 'DESC']] // Ordena por fecha en orden descendente
  });

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

    // Verificamos si todos los campos necesarios están presentes
    if (descripcion === undefined || imagen === undefined || id_usuario === undefined) {
      throw new Error('Todos los campos son requeridos para una actualización completa');
    }

    // Actualizamos la publicación usando el modelo Sequelize
    const [numFilasActualizadas] = await Publicacion.update({
      descripcion,
      imagen,
      id_usuario,
      fecha: Sequelize.literal('NOW()')
    }, {
      where: { id_publicacion }
    });

    if (numFilasActualizadas === 0) {
      console.log('No se pudo actualizar la publicación');
      return null;
    }

    // Retornamos la publicación actualizada
    return await Publicacion.findByPk(id_publicacion);

  } catch (error) {
    console.error('Error al actualizar la publicación:', error);
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

    console.log(datosPublicacion);
    console.log(id_publicacion);
    const { descripcion, imagen } = datosPublicacion;

    // Modificamos esta parte para permitir actualizaciones parciales
    let camposActualizar = {};
    if (descripcion) camposActualizar.descripcion = descripcion;
    if (imagen) camposActualizar.imagen = imagen;

    if (Object.keys(camposActualizar).length === 0) {
      throw new Error('Se requiere al menos un campo para actualizar');
    }

    camposActualizar.fecha = Sequelize.literal('NOW()');

    const [numFilasActualizadas] = await Publicacion.update(camposActualizar, {
      where: { id_publicacion }
    });

    if (numFilasActualizadas === 0) {
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
