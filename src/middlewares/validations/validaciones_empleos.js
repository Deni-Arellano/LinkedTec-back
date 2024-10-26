const Joi = require('joi');
const CreateConflictError = require('../exceptions/CreateConflictError');
const EmpleoNotFoundError = require('../exceptions/EmpleoNotFoundError');
const UpdateConflictError = require('../exceptions/UpdateConflictError');
const sequelize = require('../../config/database');


const empleoSchemaCrear = Joi.object({
  titulo: Joi.string()
    .max(255)
    .pattern(/^(?=.*[a-zA-Z])[\w\s]+$/)
    .required()
    .messages({
      'string.empty': '¡Ups! Parece que olvidaste poner el título del empleo.',
      'string.max': 'El título es demasiado largo, mejor intenta con menos de 255 caracteres.',
      'string.pattern.base': 'El título no puede ser solo números o caracteres especiales.'
    }),
  
  empresa: Joi.string()
    .max(255)
    .pattern(/^(?=.*[a-zA-Z])[\w\s]+$/) 
    .required()
    .messages({
      'string.empty': 'Por favor, indica el nombre de la empresa.',
      'string.max': 'El nombre de la empresa no puede ser tan largo, intenta con menos de 255 caracteres.',
      'string.pattern.base': 'El nombre de la empresa no puede ser solo números o caracteres especiales.'
    }),
  
  salario: Joi.number().min(0).required().messages({
    'number.base': 'El salario debe ser un número. No se permiten letras ni caracteres especiales.',
    'number.min': 'El salario no puede ser negativo. ¡Revisa ese dato!',
    'any.required': 'Por favor, indícanos el salario ofrecido para este empleo.'
  }),
  
  descripcion: Joi.string()
    .min(10)
    .required()
    .messages({
      'string.empty': 'No olvides describir el empleo, ¡queremos saber más!',
      'string.min': 'La descripción es muy corta, cuéntanos un poco más sobre este empleo (mínimo 10 caracteres).'
    }),
  
  ubicacion: Joi.string()
    .max(255)
    .pattern(/^(?=.*[a-zA-Z])[\w\s]+$/) 
    .required()
    .messages({
      'string.empty': '¿Dónde está ubicado este empleo? No te olvides de incluir la ubicación.',
      'string.max': 'La ubicación no puede ser tan larga, intenta reducirla a menos de 255 caracteres.',
      'string.pattern.base': 'La ubicación no puede ser solo números o caracteres especiales.'
    }),
  
  nivel_de_ingles: Joi.string()
    .valid('Avanzado', 'Intermedio', 'Básico', 'No aplica')
    .required()
    .messages({
      'any.only': 'Por favor, selecciona un nivel de inglés válido (Avanzado, Intermedio, Básico o No aplica).',
      'any.required': 'Especifica el nivel de inglés requerido para este empleo.'
    }),
  
  id_usuario: Joi.number().required().messages({
    'any.required': '¡Ups! Parece que olvidaste proporcionar el ID del usuario. Esto es necesario.',
    'number.base': 'El ID del usuario debe ser un número. Por favor, revisa ese dato.'
  }),
});
  


const validarEmpleo = (data) => {
  const { error } = empleoSchemaCrear.validate(data);
  return error;
};


const verificarEmpleoPorId = async (id_empleo) => {
  try {
    const empleo = await sequelize.query(
      'SELECT * FROM empleos WHERE id_empleo = :id_empleo',
      {
        replacements: { id_empleo },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (empleo.length === 0) {
      throw new EmpleoNotFoundError('Empleo no encontrado.');
    }

    return empleo[0];
  } catch (error) {
    throw error;
  }
};

const validarActualizacionEmpleo = async (id_empleo, datosActualizados) => {
  try {
    const empleo = await verificarEmpleoPorId(id_empleo);

    if (!empleo) {
      throw new UpdateConflictError('Hubo un error de actualización');
    }

    const empleoActualizado = await sequelize.query(
      `UPDATE empleos SET titulo = :titulo, empresa = :empresa, salario = :salario, descripcion = :descripcion, 
      ubicacion = :ubicacion, nivel_de_ingles = :nivel_de_ingles WHERE id_empleo = :id_empleo`,
      {
        replacements: {
          ...datosActualizados,
          id_empleo: id_empleo
        },
        type: sequelize.QueryTypes.UPDATE
      }
    );

    return empleoActualizado;
  } catch (error) {
    throw error;
  }
};

const validarCreacionEmpleo = async (datosEmpleo) => {
  try {
    const nuevoEmpleo = await sequelize.query(
      `INSERT INTO empleos (titulo, empresa, salario, descripcion, ubicacion, nivel_de_ingles, id_usuario)
      VALUES (:titulo, :empresa, :salario, :descripcion, :ubicacion, :nivel_de_ingles, :id_usuario)`,
      {
        replacements: datosEmpleo,
        type: sequelize.QueryTypes.INSERT
      }
    );

    if (!nuevoEmpleo) {
      throw new CreateConflictError('Hubo un error de creación');
    }

    return nuevoEmpleo;
  } catch (error) {
    throw error;
  }
};

const validarUpdateConflict = (empleo) => {
  if (!empleo) {
    throw new UpdateConflictError('Hubo un error de actualización. El empleo no existe.');
  }
};


module.exports = {
  validarEmpleo,
  verificarEmpleoPorId,
  validarActualizacionEmpleo,
  validarCreacionEmpleo,
  validarUpdateConflict,
};
