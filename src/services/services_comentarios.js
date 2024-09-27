const Comentario = require('../models/comentarios');
const Usuario = require('../models/usuarios'); // Asegúrate de tener el modelo de usuario

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

const sequelize = require('../config/database'); // Asegúrate de importar correctamente tu instancia de sequelize
const obtenerComentariosPorPublicacion = async (id_publicacion) => {
  try {
    const comentarios = await Comentario.findAll({
      where: { id_publicacion },
      include: [
        {
          model: Usuario,
          as: 'usuario', // Debe coincidir con la asociación
          attributes: ['imagen_usuario', 'nombre', 'apellido_paterno', 'apellido_materno']
        }
      ]
    });

    if (comentarios.length === 0) {
      throw new Error('No se encontraron comentarios para esta publicación');
    }

    // Transformar los comentarios para incluir la información del usuario
    const comentariosConUsuario = comentarios.map(comentario => {
      return {
        texto: comentario.texto, // Asegúrate de que 'texto' es el nombre correcto de la columna
        fecha: comentario.fecha,
        usuario: comentario.usuario // Esto incluirá la información del usuario
      };
    });

    return comentariosConUsuario;
  } catch (error) {
    console.error('Error en obtenerComentariosPorPublicacion:', error);
    throw new Error('Error al obtener comentarios');
  }
};

const obtenerComentarioPorPublicacionYComentario = async (id_publicacion, id_comentario) => {
  return await Comentario.findOne({
      where: {
          id_publicacion: id_publicacion,
          id_comentario: id_comentario
      },
      include: [{
          model: Usuario, // Asegúrate de que este es el nombre correcto de tu modelo
          as: 'usuario', // Asegúrate de que el alias coincida con el definido en tu modelo
          attributes: ['imagen_usuario', 'nombre']
      }]
  });
};


module.exports = { 
  crearComentario, 
  eliminarComentario, 
  obtenerComentariosPorPublicacion,
  obtenerComentarioPorPublicacionYComentario
 };
