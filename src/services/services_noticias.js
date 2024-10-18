const Noticia= require('../models/noticias.js');
const db = require('../config/database');
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
 * Elimina una noticia de la base de datos utilizando su ID.
 * 
 * @docs:exports
 * 
 * @param {number} id_noticia - El ID de la noticia que se desea eliminar.
 * @returns {Promise<boolean>} - Devuelve `true` si la noticia fue eliminada correctamente, o `false` si no se encontró la noticia.
 * 
 * @throws {Error} - Lanza un error si ocurre algún problema durante la eliminación de la noticia.
 */
exports.eliminarNoticia = async (id_noticia) => {
  const sequelize = require('sequelize');
  
  // Iniciar una transacción
  const t = await sequelize.transaction();

  try {
    // Buscar la noticia por su ID
    const noticia = await Noticia.findByPk(id_noticia, { transaction: t });

    if (!noticia) {
      // Si no se encuentra la noticia, se revierte la transacción y se retorna false
      await t.rollback();
      return false;
    }

    // Eliminar la noticia
    await noticia.destroy({ transaction: t });

    // Confirmar la transacción
    await t.commit();

    return true;
  } catch (error) {
    // Revertir la transacción en caso de error
    await t.rollback();
    throw new Error('Error al eliminar la noticia: ' + error.message);
  }
};



/**
 * Actualiza una noticia en la base de datos.
 * 
 * @docs:exports
 * 
 * @param {number} id_noticia - El ID de la noticia a actualizar.
 * @param {Object} datosNoticia - Los nuevos datos para actualizar la noticia.
 * @param {string} [datosNoticia.titulo] - El nuevo título de la noticia (opcional).
 * @param {string} [datosNoticia.descripcion] - La nueva descripción de la noticia (opcional).
 * @param {string} [datosNoticia.autor] - El nuevo autor de la noticia (opcional).
 * @returns {Promise<Object|boolean>} - La noticia actualizada o `false` si no se encuentra la noticia.
 * 
 * @throws {Error} - Lanza un error si ocurre algún problema durante la actualización de la noticia.
 */
exports.actualizarNoticia = async (id_noticia, datosNoticia) => {
  const sequelize = require('sequelize');
  
  // Iniciar una transacción
  const t = await sequelize.transaction();

  try {
    // Buscar la noticia por su ID
    const noticia = await Noticia.findByPk(id_noticia, { transaction: t });

    if (!noticia) {
      // Si la noticia no existe, se retorna false
      await t.rollback();
      return false;
    }

    // Actualizar la noticia con los nuevos datos
    await noticia.update(datosNoticia, { transaction: t });

    // Confirmar la transacción
    await t.commit();

    return noticia;
  } catch (error) {
    // Revertir la transacción en caso de error
    await t.rollback();
    throw new Error('Error al actualizar la noticia: ' + error.message);
  }
};



/**
 * @async
 * Servicio para obtener una noticia por su ID.
 * @param {number} id_noticia - El ID de la noticia.
 * @returns {Promise<Object>} Devuelve la noticia encontrada o un error.
 */
exports.obtenerNoticiaPorId = async (id_noticia) => {
  try {
    const noticia = await Noticia.findByPk(parseInt(id_noticia, 10));
    if (!noticia) {
      return { success: false, error: 'Noticia no encontrada' };
    }
    return { success: true, data: noticia };
  } catch (error) {
    console.error('Error en obtenerNoticiaPorId:', error); // Log para depuración
    return { success: false, error: error.message };
  }
};


exports.obtenerTodasLasNoticias = async () => {
  try {
      const noticias = await Noticia.findAll();

      if (noticias.length === 0) {
          return { success: false, message: "No se encontraron noticias" };
      }

      return { success: true, data: noticias };
  } catch (error) {
      return { success: false, error: error.message };
  }
};