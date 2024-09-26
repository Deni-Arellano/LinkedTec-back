const Empleo = require('../models/empleos');

// Servicio para obtener todos los empleos
exports.obtenerTodosLosEmpleos = async () => {
  try {
    const empleos = await Empleo.findAll();
    return { success: true, data: empleos };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Servicio para crear un nuevo empleo
exports.crearEmpleo = async (datosEmpleo) => {
  try {
    // Validaciones de campos
    const { titulo, empresa, salario, descripcion, ubicacion, nivel_de_ingles } = datosEmpleo;

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

    const empleo = await Empleo.create(datosEmpleo);
    return { success: true, data: empleo };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Servicio para obtener empleo por ID
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

// Servicio para editar un empleo
exports.editarEmpleo = async (id_empleo, datosActualizados) => {
  try {
    const empleo = await Empleo.findByPk(id_empleo);
    if (!empleo) {
      return { success: false, error: 'Empleo no encontrado' };
    }

    // Validaciones de campos para edición
    const { titulo, empresa, salario, descripcion, ubicacion, nivel_de_ingles } = datosActualizados;

    if (titulo && (titulo.length < 5 || titulo.length > 255)) {
      return { success: false, error: 'El título debe tener entre 5 y 255 caracteres' };
    }
    if (empresa && (empresa.length < 3 || empresa.length > 255)) {
      return { success: false, error: 'La empresa debe tener entre 3 y 255 caracteres' };
    }
    if (salario && salario < 0) {
      return { success: false, error: 'El salario no puede ser negativo' };
    }
    if (descripcion && descripcion.length < 10) {
      return { success: false, error: 'La descripción debe tener al menos 10 caracteres' };
    }
    if (ubicacion && (ubicacion.length < 3 || ubicacion.length > 255)) {
      return { success: false, error: 'La ubicación debe tener entre 3 y 255 caracteres' };
    }
    if (nivel_de_ingles && !['Avanzado', 'Intermedio', 'Básico', 'No aplica'].includes(nivel_de_ingles)) {
      return { success: false, error: 'El nivel de inglés debe ser uno de los siguientes: Avanzado, Intermedio, Básico, No aplica' };
    }

    await empleo.update(datosActualizados);
    return { success: true, message: 'Empleo actualizado correctamente', data: empleo };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Servicio para eliminar un empleo por ID
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