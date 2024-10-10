const Noticia= require('../models/noticias.js');
const sequelize = require('../config/database.js');

/**
 * @async
 * Servicio para crear una nueva noticia.
 * @param {Object} datosNoticia - Los datos de la nueva noticia.
 * @returns {Promise<Object>} Devuelve la noticia creada o un error.
 */ 
exports.crearNoticia = async (datosNoticia) => {
  try {
    const noticia = await Noticia.create(datosNoticia);
    return { success: true, data: noticia };
  } catch (error) {
    return { success: false, error: error.message };
  }
};



/**
 * 
 * @param {number} id_noticia 
 * @description Elimina una noticia en la base de datos utilizando el id de la noticia misma
 * @returns true si la noticia fue eliminada correctamente, false si no se pudo eliminar
 * 
 */
exports.eliminarNoticia = async (id_noticia) => {

  const noticia = await Noticia.findByPk(id_noticia);
  
  if (!noticia) {
    return false;
  }

  noticia.destroy();
  return true;


};


exports.actualizarNoticia = async (id_noticia, datosNoticia) => {

  const noticia = await Noticia.findByPk(id_noticia);
  console.log(noticia);
  if (!noticia) {
    return false;
  }

  noticia.update(datosNoticia);

  return noticia;


};



/**
 * Función para obtener una noticia por su ID
 * @param {number} id_noticia - ID de la noticia a buscar.
 * @returns {Promise<Object>} - La noticia encontrada o un error si no se encuentra.
 */
exports.obtenerNoticiaPorIdServicio = async (id_noticia) => {
  try {
    console.log(id_noticia);
    const noticia = await Noticia.findByPk(id_noticia);

    if (!noticia) {
      throw new Error('Noticia no encontrada');
    }

    return noticia;
  } catch (error) {
    console.error('Error al obtener noticia por ID:', error);
    throw new Error('Error al obtener noticia');
  }
};