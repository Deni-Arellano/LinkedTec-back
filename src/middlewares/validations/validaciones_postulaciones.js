const Joi = require('joi');
const SubirArchivoCloudinary = require('../../util/SubirArchivosCloudinary');


//importaciones de excepciones
const ResourceNotFoundError = require('../exceptions/cloudinary/ResourceNotFound');

//Objetos de validacion
const subirArchivoCloudinary = new SubirArchivoCloudinary();
// Esquema de validación para la creación de una postulación
const crearPostulacionSchema = Joi.object({
  id_usuario: Joi.number()
    .integer()
    .required()
    .messages({
      'any.required': 'El campo "id_usuario" es obligatorio.',
      'number.base': 'El campo "id_usuario" debe ser un número entero.'
    }),

  id_empleo: Joi.number()
    .integer()
    .required()
    .messages({
      'any.required': 'El campo "id_empleo" es obligatorio.',
      'number.base': 'El campo "id_empleo" debe ser un número entero.'
    }),

  descripcion_personal: Joi.string()
    .max(500)
    .required()
    .messages({
      'any.required': 'El campo "descripcion_personal" es obligatorio.',
      'string.base': 'El campo "descripcion_personal" debe ser una cadena de texto.',
      'string.max': 'El campo "descripcion_personal" no debe exceder los 500 caracteres.',
      'string.empty': 'El campo "descripcion_personal" no debe estar vacío.'
    }),

  cv: Joi.object({
    id_recurso: Joi.string()
      .required()
      .messages({
        'any.required': 'El campo "id_recurso" es obligatorio.',
        'string.base': 'El campo "id_recurso" debe ser una cadena de texto.',
        'string.empty': 'El campo "descripcion_personal" no debe estar vacío.'
      }),

    id_publico: Joi.string()
      .required()
      .messages({
        'any.required': 'El campo "id_publico" es obligatorio.',
        'string.base': 'El campo "id_publico" debe ser una cadena de texto.',
        'string.empty': 'El campo "descripcion_personal" no debe estar vacío.'

      }),

    formato: Joi.string()
      .valid('pdf')
      .required()
      .messages({
        'any.required': 'El campo "formato" es obligatorio.',
        'string.base': 'El campo "formato" debe ser una cadena de texto.',
        'any.only': 'El campo "formato" debe ser "pdf".',
        'string.empty': 'El campo "descripcion_personal" no debe estar vacío.'

      }),

    tipo_recurso: Joi.string()
      .valid('archivo')
      .required()
      .messages({
        'any.required': 'El campo "tipo_recurso" es obligatorio.',
        'string.base': 'El campo "tipo_recurso" debe ser una cadena de texto.',
        'any.only': 'El campo "tipo_recurso" debe ser "archivo".',
        'string.empty': 'El campo "descripcion_personal" no debe estar vacío.'
      }),

    fecha_creacion: Joi.date()
      .iso()
      .required()
      .messages({
        'any.required': 'El campo "fecha_creacion" es obligatorio.',
        'date.base': 'El campo "fecha_creacion" debe ser una fecha válida en formato ISO.'
      }),

    url_segura: Joi.string()
      .uri()
      .required()
      .messages({
        'any.required': 'El campo "url_segura" es obligatorio.',
        'string.base': 'El campo "url_segura" debe ser una cadena de texto.',
        'string.uri': 'El campo "url_segura" debe ser una URL válida.',
        'string.empty': 'El campo "descripcion_personal" no debe estar vacío.'
      }),

    carpeta: Joi.string()
      .required()
      .messages({
        'any.required': 'El campo "carpeta" es obligatorio.',
        'string.base': 'El campo "carpeta" debe ser una cadena de texto.',
        'string.empty': 'El campo "descripcion_personal" no debe estar vacío.'
      }),

    nombre_original: Joi.string()
      .required()
      .messages({
        'any.required': 'El campo "nombre_original" es obligatorio.',
        'string.base': 'El campo "nombre_original" debe ser una cadena de texto.',
        'string.empty': 'El campo "descripcion_personal" no debe estar vacío.'
      }),

    tipo_subida: Joi.string()
      .valid('archivo')
      .required()
      .messages({
        'any.required': 'El campo "tipo_subida" es obligatorio.',
        'string.base': 'El campo "tipo_subida" debe ser una cadena de texto.',
        'any.only': 'El campo "tipo_subida" debe ser "archivo".',
        'string.empty': 'El campo "descripcion_personal" no debe estar vacío.'
      })
  }).required(),

  id_estado: Joi.number()
    .integer()
    .required()
    .messages({
      'any.required': 'El campo "id_estado" es obligatorio.',
      'number.base': 'El campo "id_estado" debe ser un número entero.',
      'string.empty': 'El campo "descripcion_personal" no debe estar vacío.'
    })
});




const validarCamposCrearPostulacion = async (descripcion) => {

    return crearPostulacionSchema.validate(descripcion);

};


const validarRecursoExistente = async (recurso) => {
    try {
        const resultado = await subirArchivoCloudinary.verificarArchivo(recurso.id_publico);
        return resultado;
    } catch (error) {
        throw new ResourceNotFoundError(`El recurso /${recurso.id_publico}/ no existe o no fue posible localizarlo en Cloudinary`);
    }
};const sequelize = require('../../config/database');
const PostulacionNotFoundError = require('../exceptions/postulaciones/PostulacionNotFoundError');






const validarPostulacionExistente = async (id_postulacion) => {
  const postulacion = await sequelize.query('SELECT * FROM postulacion WHERE id_postulacion = ?', {
    replacements: [id_postulacion],
    type: sequelize.QueryTypes.SELECT,
    
  });
  if (postulacion.length === 0) {
    throw new PostulacionNotFoundError();
  }
};

module.exports = {
    validarPostulacionExistente,
    validarCamposCrearPostulacion,
    validarRecursoExistente
    
}