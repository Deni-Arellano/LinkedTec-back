const Joi = require('joi');
const sequelize = require('../../config/database');
const Docente = require('../../models/docentes');
const ValidationNumberEmpleoyeeError = require('../exceptions/ValidationNumberEmployeeError');

const validarRegistroDocente = async (data) => {
    const validarRegistroDocente = Joi.object({
        numero_empleado: Joi.string().alphanum().pattern(/^RH/).max(5).required().messages({
            'string.empty': 'El número de empleado es obligatorio',
            'string.max': 'El número de empleado no puede tener más de 5 caracteres', // Corregido el mensaje a 5 caracteres
            'string.pattern.base': 'El número de empleado debe comenzar con "RH"' // Mensaje para la nueva validación
        }),
        ultimo_nivel_estudios: Joi.string().valid('Licenciatura', 'Maestría', 'Doctorado').required().messages({
            'any.only': 'El último nivel de estudios debe ser Licenciatura, Maestría o Doctorado',
            'string.empty': 'El último nivel de estudios es obligatorio'
        }),
        academia: Joi.string().valid('IE', 'ISC', 'II', 'IA', 'CP', 'IGE').required().messages({
            'any.only': 'La academia debe ser uno de los valores permitidos: IE, ISC, II, IA, CP, IGE',
            'string.empty': 'La academia es obligatoria'
        }),
        });
    
        return validarRegistroDocente.validate(data);
    };

const validarNumeroDocente = async (numero_empleado) => {
    const docentes=await Docente.findAll({
        where: {
            numero_empleado: numero_empleado
        }
    });
    if(docentes.length>0){
        throw new ValidationNumberEmpleoyeeError();
    }
}

const validarEdicionDocente = async (data) => {
    const schemaEdicion = Joi.object({
        numero_empleado: Joi.string().alphanum().pattern(/^RH/).max(5).optional().messages({
            'string.empty': 'El número de empleado no puede estar vacío',
            'string.max': 'El número de empleado no puede tener más de 5 caracteres', // Corregido el mensaje a 5 caracteres
            'string.pattern.base': 'El número de empleado debe comenzar con "RH"' // Mensaje para la nueva validación
        }),
        ultimo_nivel_estudios: Joi.string().valid('Licenciatura', 'Maestría', 'Doctorado').optional().messages({
            'any.only': 'El último nivel de estudios debe ser Licenciatura, Maestría o Doctorado',
            'string.empty': 'El último nivel de estudios no puede estar vacío'
        }),
        academia: Joi.string().valid('IE', 'ISC', 'II', 'IA', 'CP', 'IGE').optional().messages({
            'any.only': 'La academia debe ser uno de los valores permitidos: IE, ISC, II, IA, CP, IGE',
            'string.empty': 'La academia no puede estar vacía'
        }),
    });

    return schemaEdicion.validate(data);
};

module.exports = {validarRegistroDocente, validarNumeroDocente, validarEdicionDocente};
