const Comentario = require('../models/comentarios');
const Usuario = require('../models/usuarios'); 
const {validarComentarioExistente} = require('../middlewares/validations/validaciones_comentarios');

// Crear un comentario
const crearComentario = async (data) => {
    return await Comentario.create(data);
};

// Eliminar un comentario
const eliminarComentario = async (id) => {
    return await Comentario.destroy({
        where: { id_comentario: id }
    });
};

const sequelize = require('../config/database'); 
const obtenerComentariosPorPublicacion = async (id_publicacion) => {
  try {
    const comentarios = await Comentario.findAll({
      where: { id_publicacion },
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['imagen_usuario', 'nombre', 'apellido_paterno', 'apellido_materno']
        }
      ]
    });

    // Verificar si no se encontraron comentarios
    if (comentarios.length === 0) {
      throw { name: 'CommentNotFoundError', message: 'No se encontraron comentarios para esta publicación' };
    }

    // Transformar los comentarios para incluir la información del usuario
    const comentariosConUsuario = comentarios.map(comentario => ({
      texto: comentario.texto, 
      fecha: comentario.fecha,
      usuario: comentario.usuario, 
      apellido_paterno: comentario.usuario.apellido_paterno,
      apellido_materno: comentario.usuario.apellido_materno
    }));

    return comentariosConUsuario;

  } catch (error) {
    throw error;
  }
};


const obtenerComentarioPorPublicacionYComentario = async (id_publicacion, id_comentario) => {
  return await Comentario.findOne({
      where: {
          id_publicacion: id_publicacion,
          id_comentario: id_comentario
      },
      include: [{
          model: Usuario, 
          as: 'usuario', 
          attributes: ['imagen_usuario', 'nombre','apellido_paterno', 'apellido_materno']
      }]
  });
};


module.exports = { 
  crearComentario, 
  eliminarComentario, 
  obtenerComentariosPorPublicacion,
  obtenerComentarioPorPublicacionYComentario
 };
