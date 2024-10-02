const Joi = require('joi');
const sequelize = require('../../config/database');
const CommentExistsError = require('../exceptions/CommentExistsError');
const CommentNotFoundError = require('../exceptions/CommentNotFoundError');
const PublicationNotFoundError = require('../exceptions/PublicationNotFoundError');
const FileNotFoundError = require('../exceptions/FileNotFoundError');
const FileDownloadError = require('../exceptions/FileDownloadError');
const Usuario = require('../../models/usuarios');

const validarComentario = (comentario) => {
  const schema = Joi.object({
    texto: Joi.string().max(255).required().messages({
        'string.base': 'El texto debe ser un texto válido.',
        'string.empty': 'El texto no puede estar vacío.',
        'string.max': 'El texto no puede exceder los 255 caracteres.',
        'any.required': 'El campo texto es obligatorio.',
      }),
    id_usuario: Joi.number().integer().required().messages({
        'number.base': 'El ID de usuario debe ser un número.',
        'number.integer': 'El ID de usuario debe ser un número entero.',
        'any.required': 'El campo id_usuario es obligatorio.',
      }),
    id_publicacion: Joi.number().integer().required().messages({
        'number.base': 'El ID de publicación debe ser un número.',
        'number.integer': 'El ID de publicación debe ser un número entero.',
        'any.required': 'El campo id_publicacion es obligatorio.',
      }),
    fecha: Joi.date().required().messages({
        'date.base': 'La fecha debe ser una fecha válida.',
        'any.required': 'La fecha es obligatoria.',
      }),
  });

  return schema.validate(comentario);
};

const validarComentarioExistente = async (id_comentario) => {
    const comentario = await sequelize.models.comentarios.findOne({ where: { id_comentario } }); 
    if (!comentario) {
        throw new CommentNotFoundError();
    }
};

const validarComentarioExiste = async (id_comentario) => {
  const comentario = await sequelize.models.Comentario.findOne({ where: { id_comentario } });
  if (comentario) {
    throw new CommentExistsError();
  }
}
const validarPublicacionExistente = async (id) => {
  const publicacion = await sequelize.query('SELECT * FROM publicaciones WHERE id_publicacion = :id',
      {
          replacements: { id: id },
          type: sequelize.QueryTypes.SELECT
      });

  if (publicacion.length === 0) {
      throw new PublicationNotFoundError();
  }
}
const validarimagen = async (imagen) => {
  const results = await sequelize.query('SELECT * FROM usuarios WHERE imagen_usuario = :imagen', {
    replacements: { imagen: imagen },
    type: sequelize.QueryTypes.SELECT
  });
  
  if (results.length === 0) {
    throw new FileNotFoundError();
  }
};


const validarDescarga = async (imagen) => {
  // Verificar si la imagen es nula o está vacía
  if (!imagen || imagen.trim() === '') {
      throw new FileNotFoundError('La imagen no está disponible'); // Lanza un error si no hay imagen
  }

  // Si la imagen no es nula ni vacía, proceder con la consulta
  const results = await sequelize.query('SELECT * FROM usuarios WHERE imagen_usuario = :imagen',
      {
          replacements: { imagen: imagen },
          type: sequelize.QueryTypes.SELECT
      });

  // Verificar si la imagen no se encontró en la base de datos
  if (results.length === 0) {
      throw new FileDownloadError('Error al descargar la imagen'); // Error si la imagen no existe en la base de datos
  }
};


module.exports = {
  validarComentario,
  validarComentarioExistente,
  validarComentarioExiste,
  validarPublicacionExistente,
  validarimagen,
  validarDescarga
 
};
