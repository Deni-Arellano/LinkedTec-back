const Joi = require('joi');
const sequelize = require('../../config/database');
const Estudiante = require('../../models/estudiantes');
const ValidationNumberStudentError = require('../exceptions/ValidationNumberStudentError');
const EstudianteNotFoundError = require('../exceptions/EstudianteNotFoundError');

const validarRegistroEstudiante = async (data) => {
    const validarRegistroEstudiante = Joi.object({
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
        return validarRegistroEstudiante.validate(data);

};

const validarNumeroControl = async (no_control) => {
    const estudiantes=await Estudiante.findAll({
        where: {
            no_control: no_control
        }
    });
    if(estudiantes.length>0){
        throw new ValidationNumberStudentError();
    }
}

const validarEstudianteExistente = async (id) => {
    const estudiante = await Estudiante.findOne({
        where: { id }
    });
    if (!estudiante) {
        throw new EstudianteNotFoundError();
    }
}

const validarEdicionEstudiante = async (data) => {
    const schemaEdicion = Joi.object({
        carrera: Joi.string().valid('IE', 'ISC', 'II', 'IA', 'CP', 'IGE').required().messages({
            'any.only': 'La carrera debe ser uno de los siguientes valores: IE, ISC, II, IA, CP, IGE.'
        }),
        semestre: Joi.string().valid('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX').required().messages({
            'any.only': 'El semestre debe ser uno de los siguientes valores: I, II, III, IV, V, VI, VII, VIII, IX.' 
        }),
    });

    return schemaEdicion.validate(data);
};

module.exports = {validarRegistroEstudiante, validarNumeroControl, validarEdicionEstudiante, validarEstudianteExistente};
