const Noticia= require('../models/noticias.js');

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



