const Joi = require('joi');
const {validarUsuarioExistente} = require('./validaciones_usuarios');
const {sequelize} = require('../../config/database');
const PublicationNotFoundError = require('../exceptions/PublicationNotFoundError');

const validarPublicacion = async(data) => {

    const schema = Joi.object({
        descripcion: Joi.string().min(2).max(255).required().messages({
            'string.base': 'La descripcion debe ser una cadena de texto.',
            'string.empty': 'La descripcion no puede estar vacía.',
            'string.min': 'La descripcion debe tener al menos 2 caracteres.',
            'string.max': 'La descripcion debe tener menos de 255 caracteres.',
            'any.required': 'La descripcion es requerida.'
        }),
        imagen: Joi.string().min(2).max(255).optional().messages({
            'string.base': 'La imagen debe ser una cadena de texto.',
            'string.min': 'La imagen debe tener al menos 2 caracteres.',
            'string.max': 'La imagen debe tener menos de 255 caracteres.',
        }),
        fecha: Joi.date().required().messages({
            'date.base': 'La fecha debe ser una fecha válida.',
            'any.required': 'La fecha es requerida.'
        }),
        id_usuario: Joi.number().integer().min(0).required().messages({
            'number.base': 'El id_usuario debe ser un número entero.',
            'number.integer': 'El id_usuario debe ser un número entero.',
            'number.min': 'El id_usuario no puede ser un número negativo.',
            'any.required': 'El id_usuario es requerido.'
        }),
        me_gusta: Joi.number().integer().min(0).optional().messages({
            'number.base': 'El me_gusta debe ser un número entero.',
            'number.integer': 'El me_gusta debe ser un número entero.',
            'number.min': 'El me_gusta no puede ser un número negativo.',
        }),
        disgusta: Joi.number().integer().min(0).optional().messages({
            'number.base': 'El disgusta debe ser un número entero.',
            'number.integer': 'El disgusta debe ser un número entero.',
            'number.min': 'El disgusta no puede ser un número negativo.',
        }),
    });


    return schema.validate(data);


}

const validarPublicacionExistente = async (id) => {
    const publicacion = await sequelize.query('SELECT * FROM publicaciones WHERE id = :id',
        {
            replacements: { id: id },
            type: sequelize.QueryTypes.SELECT
        });

    if (publicacion.length === 0) {
        throw new PublicationNotFoundError();
    }
}


module.exports = {
    validarPublicacion,
    validarPublicacionExistente
};