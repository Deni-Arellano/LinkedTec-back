const Joi = require('joi');

const egresadoSchema = Joi.object({
  carrera: Joi.string()
    .valid('IE', 'ISC', 'II', 'IA', 'CP', 'IGE').required()
    .messages({
      'string.base': 'La carrera debe ser un texto',
      'any.only': 'La carrera debe ser una de las siguientes: IE, ISC, II, IA, CP, IGE',
      'any.required': 'La carrera es un campo requerido'
    }),
  año_graduacion: Joi.number()
    .integer()
    .min(1900).max(new Date().getFullYear()).required()
    .messages({
      'number.base': 'El año de graduación debe ser un número',
      'number.integer': 'El año de graduación debe ser un número entero',
      'number.min': 'El año de graduación no puede ser menor que 1900',
      'number.max': 'El año de graduación no puede ser mayor que el año actual',
      'any.required': 'El año de graduación es un campo requerido'
    }),
  puesto: Joi.string()
    .max(255).required()
    .pattern(/^[A-Za-z\s]+$/)
    .messages({
      'string.base': 'El puesto debe ser un texto',
      'string.empty': 'El puesto no puede estar vacío',
      'string.max': 'El puesto debe tener como máximo 255 caracteres',
      'string.pattern.base': 'El puesto solo puede contener letras y espacios, sin números ni caracteres especiales',
      'any.required': 'El puesto es un campo requerido'
    }),
});

const idSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El ID debe ser un número',
      'number.integer': 'El ID debe ser un número entero',
      'number.positive': 'El ID debe ser un número entero positivo',
      'any.required': 'El ID es un campo requerido'
    }),
});

const validateEgresado = (data) => {
  const { error } = egresadoSchema.validate(data);
  return error;
};

const validateId = (id) => {
  const { error } = idSchema.validate({ id });
  return error;
};

const validarEgresadoExistente = async (id) => {
  const { Egresado } = require('../../db/connection');
  const egresado = await Egresado.findByPk(id);
  if (!egresado) {
    return 'Egresado no encontrado';
  }
};
module.exports = { validateEgresado, validateId, validarEgresadoExistente };
