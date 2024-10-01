const Joi = require('joi');

const validarReclutador = (reclutador) => {
  const schema = Joi.object({
    nombre_empresa: Joi.string().max(255).required().messages({
      'string.empty': 'El nombre de la empresa no puede estar vacío',
      'string.max': 'El nombre de la empresa no puede exceder los 255 caracteres',
      'any.required': 'El nombre de la empresa es obligatorio'
    }),
    sector_comercial: Joi.string().max(255).required().messages({
      'string.empty': 'El sector comercial no puede estar vacío',
      'string.max': 'El sector comercial no puede exceder los 255 caracteres',
      'any.required': 'El sector comercial es obligatorio'
    }),
    sede: Joi.string().max(255).optional().messages({
      'string.max': 'La sede no puede exceder los 255 caracteres',
      'any.required': 'La sede es obligatoria',
        'string.empty': 'La sede no puede estar vacía'
    }),
    giro: Joi.string().valid('Comercial', 'Servicio', 'Manufacturera', 'Agricultura').required().messages({
      'any.only': 'El giro debe ser uno de los siguientes: Comercial, Servicio, Manufacturera, Agricultura',
      'any.required': 'El giro es obligatorio'
    })
  });

  return schema.validate(reclutador);
};

module.exports = { validarReclutador };
