const Empleo = require('../models/empleos');

/**
 * @async
 * Servicio para crear un nuevo empleo.
 * @param {Object} datosEmpleo - Los datos del nuevo empleo.
 * @returns {Promise<Object>} Devuelve el empleo creado o un error.
 */
exports.crearEmpleo = async (datosEmpleo) => {
  try {
    const empleo = await Empleo.create(datosEmpleo);
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
    // Obtenemos los empleos con paginación
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
 * Servicio para obtener un empleo por ID.
 * @param {number} id_empleo - El ID del empleo.
 * @returns {Promise<Object>} Devuelve el empleo o un error.
 */
exports.obtenerEmpleoPorId = async (id_empleo) => {
  try {
    const empleo = await Empleo.findByPk(id_empleo);
    if (!empleo) {
      return { success: false, error: 'Empleo no encontrado' };
    }
    return { success: true, data: empleo };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * @async
 * Servicio para editar un empleo por ID.
 * @param {number} id_empleo - El ID del empleo a editar.
 * @param {Object} datosActualizados - Los nuevos datos del empleo.
 * @returns {Promise<Object>} Devuelve el empleo actualizado o un error.
 */
exports.editarEmpleo = async (id_empleo, datosActualizados) => {
  try {
    const empleo = await Empleo.findByPk(id_empleo);
    if (!empleo) {
      return { success: false, error: 'Empleo no encontrado' };
    }

    await empleo.update(datosActualizados);
    return { success: true, message: 'Empleo actualizado correctamente', data: empleo };
  } catch (error) {
    return { success: false, error: error.message };
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
