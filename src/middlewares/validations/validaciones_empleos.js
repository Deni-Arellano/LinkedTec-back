const Joi = require('joi');
const CreateConflictError = require('../exceptions/CreateConflictError');
const EmpleoExistsError = require('../exceptions/EmpleoExistsError');
const EmpleoNotFoundError = require('../exceptions/EmpleoNotFoundError');
const UpdateConflictError = require('../exceptions/UpdateConflictError');

const empleoSchemaCrear = Joi.object({
  titulo: Joi.string().max(255).required().messages({
    'string.empty': '¡Ups! Parece que olvidaste poner el título del empleo.',
    'string.max': 'El título es demasiado largo, mejor intenta con menos de 255 caracteres.'
  }),
  empresa: Joi.string().max(255).required().messages({
    'string.empty': 'Por favor, indica el nombre de la empresa.',
    'string.max': 'El nombre de la empresa no puede ser tan largo, intenta con menos de 255 caracteres.'
  }),
  salario: Joi.number().min(0).required().messages({
    'number.base': 'El salario debe ser un número. No se permiten letras ni caracteres especiales.',
    'number.min': 'El salario no puede ser negativo. ¡Revisa ese dato!',
    'any.required': 'Por favor, indícanos el salario ofrecido para este empleo.'
  }),
  descripcion: Joi.string().min(10).required().messages({
    'string.empty': 'No olvides describir el empleo, ¡queremos saber más!',
    'string.min': 'La descripción es muy corta, cuéntanos un poco más sobre este empleo (mínimo 10 caracteres).'
  }),
  ubicacion: Joi.string().max(255).required().messages({
    'string.empty': '¿Dónde está ubicado este empleo? No te olvides de incluir la ubicación.',
    'string.max': 'La ubicación no puede ser tan larga, intenta reducirla a menos de 255 caracteres.'
  }),
  nivel_de_ingles: Joi.string().valid('Avanzado', 'Intermedio', 'Básico', 'No aplica').required().messages({
    'any.only': 'Por favor, selecciona un nivel de inglés válido (Avanzado, Intermedio, Básico o No aplica).',
    'any.required': 'Especifica el nivel de inglés requerido para este empleo.'
  }),
  id_usuario: Joi.number().required().messages({
    'any.required': '¡Ups! Parece que olvidaste proporcionar el ID del usuario. Esto es necesario.'
  })
});

const validarEmpleo = (data) => {
  const { error } = empleoSchemaCrear.validate(data);
  return error;
};


const validarEmpleoExistente = (empleo) => {
  if (empleo) {
    throw new EmpleoExistsError('Ya existe un empleo con ese título y empresa.');
  }
};

const validarEmpleoNoEncontrado = (empleo) => {
  if (!empleo) {
    throw new EmpleoNotFoundError('Empleo no encontrado.');
  }
};

const validarUpdateConflict = (empleo) => {
  if (!empleo) {
    throw new UpdateConflictError('Hubo un error de actualización');
  }
};

const validarCreateConflict = (empleo) => {
  if (!empleo) {
    throw new CreateConflictError('Hubo un error de creación');
  }
};

module.exports = {
  validarEmpleo,
  validarEmpleoExistente,
  validarEmpleoNoEncontrado,
  validarUpdateConflict,
  validarCreateConflict
};
