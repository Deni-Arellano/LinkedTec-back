const Joi = require('joi');

const noticiaSchemaCrear = Joi.object({
  titulo_noticia: Joi.string().max(255).required().messages({
    'string.empty': '¡Ups! Parece que olvidaste poner el título de la noticia.',
    'string.max': 'El título de la noticia es demasiado largo, mejor intenta con menos de 255 caracteres.',
    'any.required': 'El título de la noticia es obligatorio, por favor agrégalo.'
  }),
  descripcion: Joi.string().min(10).required().messages({
    'string.empty': 'No olvides describir la noticia, ¡queremos saber más!',
    'string.min': 'La descripción es muy corta, cuéntanos un poco más sobre la noticia (mínimo 10 caracteres).',
    'any.required': 'La descripción es obligatoria, por favor agrégala.'
  }),
  imagen_noticia: Joi.string().max(255).uri().required().messages({
    'string.empty': 'Es necesario que incluyas una imagen de la noticia.',
    'string.max': 'La URL de la imagen es demasiado larga. Intenta con menos de 255 caracteres.',
    'string.uri': 'La imagen debe ser una URL válida, por favor revisa el enlace.',
    'any.required': 'La imagen de la noticia es obligatoria, por favor agrégala.'
  }),
  enlace_noticia: Joi.string().max(255).uri().required().messages({
    'string.empty': 'Por favor, proporciona un enlace relacionado con la noticia.',
    'string.max': 'El enlace de la noticia es demasiado largo, mejor intenta con menos de 255 caracteres.',
    'string.uri': 'El enlace debe ser una URL válida.',
    'any.required': 'El enlace de la noticia es obligatorio, por favor agrégalo.'
  }),
  categoria_noticia: Joi.string().valid('IE', 'ISC', 'II', 'IA', 'CP', 'IGE').required().messages({
    'any.only': 'Por favor, selecciona una categoría válida para la noticia (IE, ISC, II, IA, CP, IGE).',
    'any.required': 'Especifica la categoría de la noticia. Este campo es obligatorio.'
  }),
  id_usuario: Joi.number().integer().required().messages({
    'any.required': '¡Ups! Parece que olvidaste proporcionar el ID del usuario. Esto es necesario.',
    'number.base': 'El ID del usuario debe ser un número entero.'
  })
});

const validarNoticia = (data) => {
  const { error } = noticiaSchemaCrear.validate(data);
  return error;
};

module.exports = validarNoticia;
