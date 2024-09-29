const Joi = require('joi');

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

module.exports = {
  validarComentario,
};
