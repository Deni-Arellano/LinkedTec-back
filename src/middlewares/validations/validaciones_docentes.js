const Joi = require('joi');

// Definir el esquema de validación para Docentes
const validarRegistroDocente = async (data) => {
    const docenteSchema = Joi.object({
        numero_empleado: Joi.string().alphanum().max(10).required().messages({
            'string.empty': 'El número de empleado es obligatorio',
            'string.max': 'El número de empleado no puede tener más de 10 caracteres'
        }),
        ultimo_nivel_estudios: Joi.string().valid('Licenciatura', 'Maestría', 'Doctorado').required().messages({
            'any.only': 'El último nivel de estudios debe ser Licenciatura, Maestría o Doctorado',
            'string.empty': 'El último nivel de estudios es obligatorio'
        }),
        academia: Joi.string().valid('IE', 'ISC', 'II', 'IA', 'CP', 'IGE').required().messages({
            'any.only': 'La academia debe ser uno de los valores permitidos: IE, ISC, II, IA, CP, IGE',
            'string.empty': 'La academia es obligatoria'
        }),
    
    }
    
    );
    return docenteSchema.validate(data);    
};

module.exports = {validarRegistroDocente};
