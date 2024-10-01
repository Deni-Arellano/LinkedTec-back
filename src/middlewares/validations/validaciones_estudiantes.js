const Joi = require('joi');

const estudianteSchema = Joi.object({
    no_control: Joi.string().pattern(/^[0-9]{8}$/).required().messages({
        'string.pattern.base': 'El número de control debe tener exactamente 8 dígitos numéricos.'
    }),
    carrera: Joi.string().valid('IE', 'ISC', 'II', 'IA', 'CP', 'IGE').required().messages({
        'any.only': 'La carrera debe ser uno de los siguientes valores: IE, ISC, II, IA, CP, IGE.'
    }),
    semestre: Joi.string().valid('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX').required().messages({
        'any.only': 'El semestre debe ser uno de los siguientes valores: I, II, III, IV, V, VI, VII, VIII, IX.' 
    }),
});

module.exports = {estudianteSchema};
