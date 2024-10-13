const Joi = require('joi');
const NewsExistsError = require('../exceptions/NewsExistsError');
const NewsNotFoundError = require('../exceptions/NewsNotFoundError');
const NewsUpdateError = require('../exceptions/NewsUpdateError');
const sequelize = require('../../config/database');

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

// Función para validar si los datos de la noticia cumplen con el esquema.
// Si no cumplen, lanza un error indicando que la noticia ya existe.
const validarNoticiaExistente = (data) => {
  const { error } = noticiaSchemaCrear.validate(data);
  if (error) {
    throw new NewsExistsError(error.details[0].message);
  }
};

// Función para validar si los datos de la noticia no existen o son inválidos.
// Si hay un error en la validación, lanza un error indicando que no se encontró la noticia.
const validarNoticiaInexistente = (data) => {
  const { error } = noticiaSchemaCrear.validate(data);
  if (error) {
    throw new NewsNotFoundError(error.details[0].message);
  }
};

// Función para validar si un usuario tiene noticias asociadas en la base de datos.
// Si no hay noticias asociadas al usuario, lanza un error de "Noticia no encontrada".
const validarNoticiaPorUsuario = async (data) => {
  const noticia = await sequelize.query(
    'SELECT * FROM noticias WHERE id_usuario = :id_usuario', 
  {
    replacements: { id_usuario: data.id_usuario },
    type: sequelize.QueryTypes.SELECT
  });
  
  // Si no se encuentran noticias para el usuario, se lanza el error.
  if (noticia.length === 0) {
    throw new NewsNotFoundError('No existe ninguna noticia asociada a este usuario.');
  }
};

// Función para validar si los datos de la noticia son válidos antes de una actualización.
// Si los datos son inválidos, lanza un error indicando que hubo un problema al actualizar la noticia.
const actualizarNoticiaError = (data) => {
  const { error } = noticiaSchemaCrear.validate(data);
  if (error) {
    throw new NewsUpdateError(error.details[0].message);
  }
};


module.exports = validarNoticia,
  validarNoticiaExistente,
  validarNoticiaInexistente,
  validarNoticiaPorUsuario,
  actualizarNoticiaError;
