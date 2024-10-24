const Joi = require('joi');
const sequelize = require('../../config/database');
const UserNotFoundError = require('../exceptions/UserNotFoundError');
const UserExistsError = require('../exceptions/UserExistsError');
const EmailExistsError = require('../exceptions/EmailExistsError');
const Usuario = require('../../models/usuarios');

const validarRegistroUsuario = async (data) => {
  const schema = Joi.object({
    nombre: Joi.string()
      .min(2)
      .max(255)
      .pattern(/^[a-zA-Z\s]+$/) // Solo letras y espacios
      .required()
      .messages({
        'string.base': 'El nombre debe ser una cadena de texto.',
        'string.empty': 'El nombre no puede estar vacío.',
        'string.min': 'El nombre debe tener al menos 2 caracteres.',
        'string.max': 'El nombre debe tener menos de 255 caracteres.',
        'string.pattern.base': 'El nombre no puede contener caracteres especiales.',
        'any.required': 'El nombre es requerido.'
      }),
    apellido_paterno: Joi.string()
      .min(2)
      .max(255)
      .pattern(/^[a-zA-Z\s]+$/) // Solo letras y espacios
      .required()
      .messages({
        'string.base': 'El apellido paterno debe ser una cadena de texto.',
        'string.empty': 'El apellido paterno no puede estar vacío.',
        'string.min': 'El apellido paterno debe tener al menos 2 caracteres.',
        'string.max': 'El apellido paterno debe tener menos de 255 caracteres.',
        'string.pattern.base': 'El apellido paterno no puede contener caracteres especiales.',
        'any.required': 'El apellido paterno es requerido.'
      }),
    apellido_materno: Joi.string()
      .min(2)
      .max(255)
      .allow("")
      .optional()
      .pattern(/^[a-zA-Z\s]+$/) // Solo letras y espacios
      .messages({
        'string.base': 'El apellido materno debe ser una cadena de texto.',
        'string.empty': 'El apellido materno no puede estar vacío.',
        'string.min': 'El apellido materno debe tener al menos 2 caracteres.',
        'string.max': 'El apellido materno debe tener menos de 255 caracteres.',
        'string.pattern.base': 'El apellido materno no puede contener caracteres especiales.',
        'any.required': 'El apellido materno es requerido.'
      }),
    correo: Joi.string()
      .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/)
      .required()
      .messages({
        'string.base': 'El correo debe ser una cadena de texto.',
        'string.empty': 'El correo no puede estar vacío.',
        'string.pattern.base': 'El correo debe ser una dirección de correo electrónico válida y no puede tener un dominio que comience con un número.',
        'any.required': 'El correo es requerido.'
      }),
    contraseña: Joi.string()
      .min(8)
      .max(20)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .required()
      .messages({
        'string.base': 'La contraseña debe ser una cadena de texto.',
        'string.empty': 'La contraseña no puede estar vacía.',
        'string.min': 'La contraseña debe tener al menos 8 caracteres.',
        'string.max': 'La contraseña debe tener menos de 20 caracteres.',
        'string.pattern.base': 'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.',
        'any.required': 'La contraseña es requerida.'
      }),
    role: Joi.string()
      .required()
      .valid('Estudiante', 'Maestro', 'Empleador', 'Empresa', 'Egresado')
      .messages({
        'string.base': 'El rol debe ser una cadena de texto.',
        'string.empty': 'El rol no puede estar vacío.',
        'any.required': 'El rol es requerido.',
        'any.only': 'El rol debe ser uno de los siguientes: Estudiante, Maestro, Empleador, Empresa, Egresado'
      }),
    imagen_usuario: Joi.string()
      .min(2)
      .max(255)
      .allow("")
      .optional()
      .messages({
        'string.base': 'La imagen debe ser una cadena de texto.',
        'string.min': 'La imagen debe tener al menos 2 caracteres.',
        'string.max': 'La imagen debe tener menos de 255 caracteres.',
      }),
    fecha_nacimiento: Joi.date()
      .less('now')
      .required()
      .messages({
        'date.base': 'La fecha de nacimiento debe ser una fecha válida.',
        'any.required': 'La fecha de nacimiento es requerida.',
        'date.less': 'La fecha de nacimiento debe ser menor a la fecha actual.'
      }),
    telefono: Joi.string()
      .pattern(/^[0-9]+$/)
      .min(10)
      .max(15)
      .required()
      .messages({
        'string.base': 'El teléfono debe ser una cadena de números.',
        'string.empty': 'El teléfono no puede estar vacío.',
        'string.min': 'El teléfono debe tener al menos 10 caracteres.',
        'string.max': 'El teléfono debe tener menos de 15 caracteres.',
        'string.pattern.base': 'El teléfono solo puede contener caracteres numéricos.',
        'any.required': 'El teléfono es requerido.'
      }),
    sexo: Joi.string()
      .required()
      .valid('Masculino', 'Femenino', 'Otro')
      .messages({
        'string.base': 'El sexo debe ser una cadena de texto.',
        'string.empty': 'El sexo no puede estar vacío.',
        'any.required': 'El sexo es requerido.',
        'any.only': 'El sexo debe ser uno de los siguientes: Masculino, Femenino, Otro.'
      }),
    biografia: Joi.string()
      .max(255)
      .allow('')
      .optional()
      .messages({
        'string.base': 'La biografía debe ser una cadena de texto.',
        'string.max': 'La biografía debe tener menos de 255 caracteres.',
      }),
  });

  const { error, value } = schema.validate(data);
  return { error, value };

};


const validarCorreoExistente = async (correo) => {
    const results = await sequelize.query(`SELECT * FROM usuarios WHERE correo = ?`, {
      replacements: [correo],
      type: sequelize.QueryTypes.SELECT
    });
  
    if (results.length > 0) {
      throw new EmailExistsError();

    }
  };
  
//Buscar si el usuario existe o no
const validarUsuarioExistente = async (id) => {

    const results = await sequelize.query(`SELECT * FROM usuarios WHERE id = ?`, {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT
    });

    if (!results || results.length === 0) {
      throw new UserNotFoundError('No se encontro el usuario, verifique que el id pertenezca a un usuario existente.');

    }
}

//Buscar si el usuario ya esta en uso
const validarUsuarioEnUso = async (id) => {
    const results = await Usuarios.findAll(
        {
            where: {
            id: id
            }
        }
    )
  
    if (results.length === 0) {
      throw new UserExistsError();
    }
}

const validarUsuarioEnUsoPlanB = async (id) => {
  const results = await Usuario.findAll({
    where: {
      id: id
    }
  });
  if (results.length === 0) {
    throw new UserExistsError();
  }
}

//Valida si hay usuarios existentes
const validarUsuariosExistentes = async (usuarios) => {

  if (usuarios.length === 0 || !usuarios) {
    throw new UserNotFoundError('No se encontraron usuarios.');
  }
}


module.exports = {
    validarRegistroUsuario,
    validarUsuarioEnUso,
    validarUsuarioExistente,
    validarCorreoExistente,
    validarUsuariosExistentes,
    validarUsuarioEnUsoPlanB
}