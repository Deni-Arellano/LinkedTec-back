const Empleo = require('../models/empleos');
const EmpleoNotFoundError = require('../middlewares/exceptions/EmpleoNotFoundError');
const UserNotFoundError = require('../middlewares/exceptions/UserNotFoundError');
const UpdateConflictError = require('../middlewares/exceptions/UpdateConflictError');
const Usuario = require('../models/usuarios');
const NotificacionService = require('./services_notificaciones');
const { Op } = require('sequelize');


/**

@async
Servicio para crear un nuevo empleo.
@param {Object} datosEmpleo - Los datos del nuevo empleo.
@returns {Promise} Devuelve el empleo creado o un error.
*/
exports.crearEmpleo = async (datosEmpleo) => {
  try {
    const empleo = await Empleo.create(datosEmpleo);

    const usuarios = await Usuario.findAll({
      where: {
        role: {
          [Op.or]: ['Egresados', 'Estudiantes']
        }
      }
    });

    if (usuarios.length > 0) {
      const notificacionesPromises = usuarios.map(async usuario => {
        const notificacionData = {
          tipo: 'empleo',
          mensaje: `Se ha creado un nuevo empleo: ${empleo.titulo}`,
          id_usuario_emisor: datosEmpleo.id_usuario,
          id_usuario_destinatario: usuario.id,
          id_referencia: empleo.id,
        };

        const notificacionCreada = await NotificacionService.crearNotificacion(notificacionData);

        await NotificacionService.enviarNotificacion(global.wss, notificacionCreada);
      });

      await Promise.all(notificacionesPromises);
    }

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


