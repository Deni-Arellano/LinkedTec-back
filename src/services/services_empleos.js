const Empleo = require('../models/empleos');
const EmpleoNotFoundError = require('../middlewares/exceptions/EmpleoNotFoundError');
const UserNotFoundError = require('../middlewares/exceptions/UserNotFoundError');
const UpdateConflictError = require('../middlewares/exceptions/UpdateConflictError');
const Usuario = require('../models/usuarios');
const { obtenerIdsUsuariosEmpleo } = require('../services/services_notificaciones');
const Notificaciones = require('../models/notificaciones');
const NotificacionesUsuarios = require('../models/notificaciones_usuarios');
const { Sequelize } = require('sequelize');

const { Op, fn, col } = require('sequelize');
const util_estadisticas = require('../util/util_estadisticas'); // Si tienes una función para mapear meses


/**
 * @async
 * Servicio para crear un nuevo empleo.
 * @param {Object} datosEmpleo - Los datos del nuevo empleo.
 * @returns {Promise<Object>} Devuelve el empleo creado o un error.
 */
exports.crearEmpleo = async (datosEmpleo) => {
  try {
      const empleo = await Empleo.create(datosEmpleo);

      const mensajeNotificacion = `Se ha publicado una nueva oferta de empleo: "${empleo.titulo}"`;

      const notificacionCreada = await Notificaciones.create({
          tipo: 'empleo',
          mensaje: mensajeNotificacion,
          id_creador: datosEmpleo.id_usuario,
          id_referencia_tipo: empleo.id_empleo,
          fecha_creacion: new Date(),
      });

      const idsUsuarios = await obtenerIdsUsuariosEmpleo();

      await Promise.all(idsUsuarios.map(id_usuario => 
          NotificacionesUsuarios.create({
              id_notificacion: notificacionCreada.id_notificacion,
              id_usuario: id_usuario
          })
      ));

      return { success: true, data: empleo };
  } catch (error) {
      return { success: false, error: error.message };
  }
};



/**
 * @async
 * Servicio para obtener todos los empleos con paginación, ordenados por fecha de creación en orden descendente.
 * @param {number} limite - La cantidad de empleos que se van a devolver.
 * @param {number} offset - El desplazamiento (cuántos empleos saltar).
 * @returns {Promise<Object>} Devuelve un objeto con los empleos y el total de empleos.
 */
exports.obtenerTodosLosEmpleos = async (limite, offset) => {
  try {
    const { rows: empleos, count: total } = await Empleo.findAndCountAll({
      order: [['fecha_creacion', 'DESC']],
      limit: limite,
      offset: offset
    });

    return { success: true, data: empleos, total: total };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


/**
 * @async
 * Obtiene un empleo específico por su ID.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con el empleo encontrado o un error.
 */
exports.obtenerEmpleoPorId = async (id_empleo) => {
  try {
    const empleo = await Empleo.findByPk(id_empleo);
    if (!empleo) {
      throw new EmpleoNotFoundError('Empleo no encontrado.');
    }
    return empleo;
  } catch (error) {
    throw error;
  }
};



/**
 * @async
 * Servicio para eliminar un empleo por ID.
 * @param {number} id_empleo - El ID del empleo a eliminar.
 * @returns {Promise<Object>} Devuelve un mensaje de éxito o un error.
 */
exports.eliminarEmpleo = async (id_empleo) => {
  try {
    const empleo = await Empleo.findByPk(id_empleo);
    if (!empleo) {
      return { success: false, error: 'Empleo no encontrado' };
    }

    await empleo.destroy();
    return { success: true, message: 'Empleo eliminado correctamente' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


/**
 * @async
 * Servicio para verificar si un usuario existe.
 * @param {number} id_usuario - El ID del usuario a verificar.
 * @returns {Promise<boolean>} Devuelve true si el usuario existe, de lo contrario false.
 */
const verificarUsuarioPorId = async (id_usuario) => {
  const usuario = await Usuario.findByPk(id_usuario);
  return !!usuario;
};

/**
 * Servicio para validar si un empleo existe.
 * @param {Object} empleo - El empleo a validar.
 */
const validarUpdateConflict = (empleo) => {
  if (!empleo) {
    throw new UpdateConflictError('Hubo un error de actualización. El empleo no existe.');
  }
};


/**
 * @async
 * Servicio para actualizar un empleo existente.
 * @param {number} id_empleo - El ID del empleo a actualizar.
 * @param {Object} datosActualizados - Los nuevos datos del empleo.
 * @returns {Promise<Object>} Devuelve el empleo actualizado o un error.
 */
exports.actualizarEmpleo = async (id_empleo, datosActualizados) => {
  const { id_usuario } = datosActualizados;

  const usuarioExiste = await verificarUsuarioPorId(id_usuario);
  if (!usuarioExiste) {
    throw new UserNotFoundError('El ID del usuario no existe.');
  }

  try {
    const empleo = await Empleo.findByPk(id_empleo);
    validarUpdateConflict(empleo); 

    const empleoActualizado = await empleo.update(datosActualizados);
    return { success: true, data: empleoActualizado };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


exports.obtenerCantidadEmpleos = async () => {

    try {

        const totalEmpleos = await Empleo.count();

        return totalEmpleos


    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener la cantidad de empleos');
    }
}


exports.obtenerCantidadEmpleosPorMes = async () => {
    try {
        // Obtener los datos agrupados por año y mes
        const results = await Empleo.findAll({
            attributes: [
                [fn('YEAR', col('fecha_creacion')), 'year'],
                [fn('MONTH', col('fecha_creacion')), 'month'],
                [fn('COUNT', col('*')), 'report_count']
            ],
            group: ['year', 'month'],
            order: [[fn('YEAR', col('fecha_creacion')), 'DESC'], [fn('MONTH', col('fecha_creacion')), 'DESC']],
        });

        // Mapear los resultados a un formato más amigable
        const groupedResults = results.reduce((acc, row) => {
            const { year, month, report_count } = row.dataValues;

            if (!acc[year]) {
                acc[year] = [];
            }

            acc[year].push({ month: util_estadisticas.mapeoDeMeses(month), report_count });

            return acc;
        }, {});

        return groupedResults;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener la cantidad de empleos por mes');
    }
};

exports.obtenerPromedioEmpleosDiarios = async () => {
    try {
        // Contar el total de empleos
        const totalEmpleos = await Empleo.count();

        // Obtener la cantidad de días únicos en los que se han registrado empleos
        const diasUnicos = await Empleo.findAll({
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('fecha_creacion')), 'dia_unico']
            ],
            group: ['dia_unico'],
        });

        // Verificar si diasUnicos tiene resultados
        const diasUnicosArray = diasUnicos || [];

        // Calcular el promedio de empleos diarios
        const promedioDiario = diasUnicosArray.length > 0 ? totalEmpleos / diasUnicosArray.length : 0;

        return Math.round(promedioDiario);
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener el promedio de empleos diarios');
    }
};