const Comentario = require('../models/comentarios');

// Obtener todos los comentarios
exports.getAllComentarios = async () => {
  try {
    return await Comentario.findAll();
  } catch (error) {
    throw new Error('Error al obtener los comentarios: ' + error.message);
  }
};

// Obtener un comentario por ID
exports.getComentarioPorId = async (id_comentario) => {
  try {
    const comentario = await Comentario.findByPk(id_comentario);
    if (!comentario) {
      throw new Error('Comentario no encontrado');
    }
    return comentario;
  } catch (error) {
    throw new Error('Error al obtener el comentario: ' + error.message);
  }
};

// Crear un nuevo comentario
exports.createComentario = async (data) => {
  try {
    const { texto, id_usuario, id_publicacion } = data;
    const fecha = new Date();

    if (!texto || !id_usuario || !id_publicacion) {
      throw new Error('Faltan datos obligatorios');
    }

    return await Comentario.create({ texto, fecha, id_usuario, id_publicacion });
  } catch (error) {
    throw new Error('Error al crear el comentario: ' + error.message);
  }
};

// Eliminar un comentario por ID
exports.deleteComentario = async (id_comentario) => {
  try {
    const comentario = await Comentario.findByPk(id_comentario);
    if (!comentario) {
      throw new Error('Comentario no encontrado');
    }

    await comentario.destroy();
    return { message: 'Comentario eliminado exitosamente' };
  } catch (error) {
    throw new Error('Error al eliminar el comentario: ' + error.message);
  }
};
