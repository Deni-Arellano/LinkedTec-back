const Noticia= require('../models/noticias.js');
const Notificaciones = require('../models/notificaciones');
const NotificacionesUsuarios = require('../models/notificaciones_usuarios');
const { obtenerIdsUsuariosNoticias } = require('../services/services_notificaciones');
const sequelize = require('../config/database');
const moment = require('moment');
const {Sequelize} = require("sequelize");
const util_estadisticas = require('../util/util_estadisticas');
/**
 * @async
 * Servicio para crear una nueva noticia.
 * @param {Object} datosNoticia - Los datos de la nueva noticia.
 * @returns {Promise<Object>} Devuelve la noticia creada o un error.
 */ 
exports.crearNoticia = async (datosNoticia) => {
  try {
    const noticia = await Noticia.create(datosNoticia);

    const mensajeNotificacion = `Se ha publicado una nueva noticia: "${noticia.titulo_noticia}"`;
    
    const notificacionCreada = await Notificaciones.create({
        tipo: 'noticia',
        mensaje: mensajeNotificacion,
        id_creador: datosNoticia.id_usuario,
        id_referencia_tipo: noticia.id_noticia,
        fecha_creacion: new Date(),
    });
    

    const idsUsuarios = await obtenerIdsUsuariosNoticias();
    await Promise.all(idsUsuarios.map(id_usuario => 
      NotificacionesUsuarios.create({
          id_notificacion: notificacionCreada.id_notificacion,
          id_usuario: id_usuario
      })
  ));

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

      return { success: true, data: noticias.reverse() };
  } catch (error) {
      return { success: false, error: error.message };
  }
};


exports.ebtenerTotalNoticias = async () => {
    try {
        const totalNoticias = await Noticia.count();
        return totalNoticias;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener la cantidad de noticias');
    }

}


exports.obtenerTotalNoticiasPorMes = async () => {
    try {
        // Obtener el año actual
        const anioActual = new Date().getFullYear();

        // Consulta SQL para obtener el conteo de noticias del año actual
        const [results] = await sequelize.query(`
            SELECT MONTH(fecha_noticia) AS mes,
                   COUNT(*)            AS cantidad
            FROM noticias
            WHERE YEAR(fecha_noticia) = :anioActual
            GROUP BY MONTH(fecha_noticia)
            ORDER BY mes;
        `, {
            replacements: { anioActual }, // Sustituir el año actual en la consulta
        });

        // Transformar los resultados para incluir el nombre del mes en español
        const datosPorMes = results.map(row => ({
            mes: util_estadisticas.mapeoDeMeses(row.mes), // Convertir el número del mes al nombre en español
            cantidad: row.cantidad, // Clave en español
        }));

        return datosPorMes; // Retornar los datos transformados
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener el total de noticias por mes');
    }
};





exports.obtenerPromedioNoticiasDiarias = async () => {
    try {
        // Contar el total de noticias
        const totalNoticias = await Noticia.count();

        // Obtener la cantidad de días únicos en los que se han registrado noticias
        const diasUnicos = await Noticia.findAll({
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('fecha_noticia')), 'dia_unico']
            ],
            group: ['dia_unico'],
            raw: true // Para que Sequelize devuelva los datos como objetos simples
        });

        // Verificar si diasUnicos tiene resultados
        const diasUnicosArray = diasUnicos.map(dia => dia.dia_unico) || []; // Obtener solo los valores de los días

        // Calcular el promedio de noticias diarias
        // Evitamos dividir entre 0 (en caso de que no haya días únicos)
        const promedioDiario = diasUnicosArray.length > 0 ? totalNoticias / diasUnicosArray.length : 0;

        return Math.round(promedioDiario);
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener el promedio de noticias diarias');
    }
};

