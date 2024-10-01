const Joi = require('joi');
const sequelize = require('../../config/database');
const UserNotFoundError = require('../exceptions/UserNotFoundError');
const UserExistsError = require('../exceptions/UserExistsError');
const EmailExistsError = require('../exceptions/EmailExistsError')

const validarRegistroUsuario =  async (data) => {

  const schema = Joi.object({
    nombre: Joi.string().min(2).max(255).required().messages({
      'string.base': 'El nombre debe ser una cadena de texto.',
      'string.empty': 'El nombre no puede estar vacío.',
      'string.min': 'El nombre debe tener al menos 2 caracteres.',
      'string.max': 'El nombre debe tener menos de 255 caracteres.',
      'any.required': 'El nombre es requerido.'
    }),
    apellido_paterno: Joi.string().min(2).max(255).required().messages({
      'string.base': 'El apellido paterno debe ser una cadena de texto.',
      'string.empty': 'El apellido paterno no puede estar vacío.',
      'string.min': 'El apellido paterno debe tener al menos 2 caracteres.',
      'string.max': 'El apellido paterno debe tener menos de 255 caracteres.',
      'any.required': 'El apellido paterno es requerido.'
    }),
    apellido_materno: Joi.string().min(2).max(255).required().messages({
      'string.base': 'El apellido materno debe ser una cadena de texto.',
      'string.empty': 'El apellido materno no puede estar vacío.',
      'string.min': 'El apellido materno debe tener al menos 2 caracteres.',
      'string.max': 'El apellido materno debe tener menos de 255 caracteres.',
      'any.required': 'El apellido materno es requerido.'
    }),
    correo: Joi.string().email().required().messages({
      'string.base': 'El correo debe ser una cadena de texto.',
      'string.empty': 'El correo no puede estar vacío.',
      'string.email': 'El correo debe ser una dirección de correo electrónico válida.',
      'any.required': 'El correo es requerido.'
    }),
    contraseña: Joi.string().min(8).max(20).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required().messages({
      'string.base': 'La contraseña debe ser una cadena de texto.',
      'string.empty': 'La contraseña no puede estar vacía.',
      'string.min': 'La contraseña debe tener al menos 8 caracteres.',
      'string.max': 'La contraseña debe tener menos de 20 caracteres.',
      'string.pattern.base': 'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.',
      'any.required': 'La contraseña es requerida.'
    }),
    role: Joi.string().required().valid('Estudiantes', 'Docentes', 'Reclutadores', 'Egresados').messages({
      'string.base': 'El rol debe ser una cadena de texto.',
      'string.empty': 'El rol no puede estar vacío.',
      'any.required': 'El rol es requerido.',
      'any.only': 'El rol debe ser uno de los siguientes: Estudiantes, Docentes, Reclutadores, Egresados.'
    }),
    imagen_usuario: Joi.string().min(2).max(255).optional().messages({
      'string.base': 'La imagen debe ser una cadena de texto.',
      'string.min': 'La imagen debe tener al menos 2 caracteres.',
      'string.max': 'La imagen debe tener menos de 255 caracteres.',
    }),
    fecha_nacimiento: Joi.date().less('now').required().messages({
      'date.base': 'La fecha de nacimiento debe ser una fecha válida.',
      'any.required': 'La fecha de nacimiento es requerida.',
      'date.less': 'La fecha de nacimiento debe ser menor a la fecha actual.'
    }),
    telefono: Joi.string().min(10).max(15).required().messages({
      'string.base': 'El teléfono debe ser una cadena de texto.',
      'string.empty': 'El teléfono no puede estar vacío.',
      'string.min': 'El teléfono debe tener al menos 10 caracteres.',
      'string.max': 'El teléfono debe tener menos de 15 caracteres.',
      'any.required': 'El teléfono es requerido.'
    }),
    sexo: Joi.string().required().valid('Masculino', 'Femenino', 'Otro').messages({
      'string.base': 'El sexo debe ser una cadena de texto.',
      'string.empty': 'El sexo no puede estar vacío.',
      'any.required': 'El sexo es requerido.',
      'any.only': 'El sexo debe ser uno de los siguientes: Masculino, Femenino, Otro.'
    }),
    biografia: Joi.string().min(2).max(255).optional().messages({
      'string.base': 'La biografia debe ser una cadena de texto.',
      'string.min': 'La biografia debe tener al menos 2 caracteres.',
      'string.max': 'La biografia debe tener menos de 255 caracteres.',
    }),
  });

  return schema.validate(data, { abortEarly: false });

};

//Busca si el correo ya esta en uso
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
    const results = await sequelize.query(`SELECT * FROM usuarios WHERE id = ?`, {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT
    });
  
    if (results.length > 0) {
      throw new UserExistsError();
    }
}



module.exports = {
    validarRegistroUsuario,
    validarUsuarioEnUso,
    validarUsuarioExistente,
    validarCorreoExistente
}