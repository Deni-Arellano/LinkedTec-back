const Joi = require('joi');
const sequelize = require('../../config/database');


const validarlogin = async (data) => {
    const loginSchema = Joi.object({
        correo: Joi.string().email().required().messages({
            'string.email': 'El correo debe tener un formato válido.',
            'any.required': 'El campo correo es requerido.',
        }),
        contraseña: Joi.string().min(8).required().messages({
            'string.min': 'La contraseña debe tener al menos 8 caracteres.',
            'any.required': 'El campo contraseña es requerido.',
        }),
    });

    return loginSchema.validate(data);
};


module.exports = { validarlogin };
