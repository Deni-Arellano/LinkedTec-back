const Empleo = require('../models/empleos');
/**
 * @async
 * Servicio para crear un nuevo empleo.
 * @param {Object} datosEmpleo - Los datos del nuevo empleo.
 * @returns {Promise<Object>} Devuelve el empleo creado o un error.
 */
exports.crearEmpleo = async (datosEmpleo) => {
  try {
    const { titulo, empresa, salario, descripcion, ubicacion, nivel_de_ingles, id_usuario } = datosEmpleo;

    // Validaciones
    if (!titulo || titulo.length < 5 || titulo.length > 255) {
      return { success: false, error: 'El título debe tener entre 5 y 255 caracteres' };
    }
    if (!empresa || empresa.length < 3 || empresa.length > 255) {
      return { success: false, error: 'La empresa debe tener entre 3 y 255 caracteres' };
    }
    if (salario < 0) {
      return { success: false, error: 'El salario no puede ser negativo' };
    }
    if (!descripcion || descripcion.length < 10) {
      return { success: false, error: 'La descripción debe tener al menos 10 caracteres' };
    }
    if (!ubicacion || ubicacion.length < 3 || ubicacion.length > 255) {
      return { success: false, error: 'La ubicación debe tener entre 3 y 255 caracteres' };
    }
    if (!['Avanzado', 'Intermedio', 'Básico', 'No aplica'].includes(nivel_de_ingles)) {
      return { success: false, error: 'El nivel de inglés debe ser uno de los siguientes: Avanzado, Intermedio, Básico, No aplica' };
    }
    if (!id_usuario) {
      return { success: false, error: 'El id_usuario es requerido' };
    }

    const empleo = await Empleo.create(datosEmpleo);
    return { success: true, data: empleo };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * @async
 * Servicio para obtener todos los empleos.
 * @returns {Promise<Object>} Devuelve un objeto con los empleos o un error.
 */
exports.obtenerTodosLosEmpleos = async () => {
  try {
    const empleos = await Empleo.findAll();
    return { success: true, data: empleos };
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

    // Validaciones
    if (!titulo || titulo.length < 5 || titulo.length > 255) {
      return { success: false, error: 'El título debe tener entre 5 y 255 caracteres' };
    }
    if (!empresa || empresa.length < 3 || empresa.length > 255) {
      return { success: false, error: 'La empresa debe tener entre 3 y 255 caracteres' };
    }
    if (salario < 0) {
      return { success: false, error: 'El salario no puede ser negativo' };
    }
    if (!descripcion || descripcion.length < 10) {
      return { success: false, error: 'La descripción debe tener al menos 10 caracteres' };
    }
    if (!ubicacion || ubicacion.length < 3 || ubicacion.length > 255) {
      return { success: false, error: 'La ubicación debe tener entre 3 y 255 caracteres' };
    }
    if (!['Avanzado', 'Intermedio', 'Básico', 'No aplica'].includes(nivel_de_ingles)) {
      return { success: false, error: 'El nivel de inglés debe ser uno de los siguientes: Avanzado, Intermedio, Básico, No aplica' };
    }
    if (!id_usuario) {
      return { success: false, error: 'El id_usuario es requerido' };
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