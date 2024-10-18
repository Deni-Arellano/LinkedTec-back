const Joi = require('joi');

const validarRegistroReportes = async (data) => {
    const validarRegistroReportes = Joi.object({
        id_usuario: Joi.number().integer().required().messages({
            'number.base': 'El ID del usuario debe ser un número.',
            'any.required': 'El ID del usuario es requerido.',
            'any.only': 'El usuario no existe.'
        }),
        tipo_reporte: Joi.string().valid(
            'acoso', 
            'amenaza', 
            'discriminación', 
            'difamación', 
            'ofensa', 
            'suplantación de identidad', 
            'fraude', 
            'otros'
        ).required().messages({
            'any.only': 'El tipo de reporte debe ser uno de los valores permitidos.',
            'any.required': 'El tipo de reporte es requerido.'
        }),
        categoria_reporte: Joi.string().valid(
            'perfil', 
            'publicaciones', 
            'noticias', 
            'empleos', 
            'foros', 
            'eventos', 
            'otros'
        ).required().messages({
            'any.only': 'La categoría de reporte debe ser uno de los valores permitidos.',
            'any.required': 'La categoría del reporte es requerida.'
        }),
        descripcion: Joi.string().min(10).max(500).required().messages({
            'string.empty': 'La descripción no puede estar vacía.',
            'string.min': 'La descripción debe tener al menos 10 caracteres.',
            'string.max': 'La descripción no puede exceder los 500 caracteres.',
            'any.required': 'La descripción es requerida.'
        }),
        id_elemento_reportado: Joi.number().integer().optional().allow(null).messages({
            'number.base': 'El ID del elemento reportado debe ser un número.'
        }),
        titulo_reporte: Joi.string().max(255).required().messages({
            'string.empty': 'El título del reporte no puede estar vacío.',
            'string.max': 'El título del reporte no puede exceder los 255 caracteres.',
            'any.required': 'El título del reporte es requerido.'
        })
    });
    return validarRegistroReportes.validate(data);
}

module.exports = {
    validarRegistroReportes
};