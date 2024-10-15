const Joi = require("joi");

exports.validarDatosCrearEvento = (data) => {


  const esquema = Joi.object({
    titulo: Joi.string().min(3).max(50).required().messages({
      "string.empty": "El título no debe estar vacío",
      "string.base": "El título debe ser un texto",
      "string.min": "El título debe tener al menos 3 caracteres",
      "string.max": "El título debe tener como máximo 50 caracteres",
      "any.required": "El título es obligatorio",
    }),

    fecha: Joi.date()
      .greater("now") // Asegura que la fecha sea futura
      .required()
      .messages({
        "date.base": "La fecha debe ser una fecha válida",
        "date.greater": "La fecha debe ser futura",
        "any.required": "La fecha es obligatoria",
      }),

    lugar: Joi.string().min(3).max(50).required().messages({
      "string.base": "El lugar debe ser un texto",
      "string.min": "El lugar debe tener al menos 3 caracteres",
      "string.max": "El lugar debe tener como máximo 50 caracteres",
      "any.required": "El lugar es obligatorio",
    }),

    descripcion: Joi.string().min(3).max(500).required().messages({
      "string.base": "La descripción debe ser un texto",
      "string.min": "La descripción debe tener al menos 3 caracteres",
      "string.max": "La descripción debe tener como máximo 500 caracteres",
      "any.required": "La descripción es obligatoria",
    }),

    enlace: Joi.string().min(3).allow("").optional().messages({
      "string.base": "El enlace debe ser un texto", 
      "string.min": "El enlace debe tener al menos 3 caracteres",
      "any.required": "El enlace es obligatorio",
    }),

    imagen: Joi.string().min(3).allow("").required().messages({// Se permite un string vacío temporal
      "string.base": "La imagen debe ser un texto",
      "string.min": "La imagen debe tener al menos 3 caracteres",
      "any.required": "La imagen es obligatoria",
    }),

    tipo_evento: Joi.string().valid("taller", "seminario", "evento general").required().messages({
        "string.base": "El tipo de evento debe ser un texto",
        "any.only":
          'El tipo de evento debe ser uno de los siguientes: "taller", "seminario", "evento general"',
        "any.required": "El tipo de evento es obligatorio",
      }),

    id_usuario: Joi.number().integer().required().messages({
      "number.base": "El ID de usuario debe ser un número",
      "number.integer": "El ID de usuario debe ser un número entero",
      "any.required": "El ID de usuario es obligatorio",
    }),
  });

  return esquema.validate(data, { abortEarly: false });
};

exports.validarParametrosPaginacion = (pagina, limite) => {

    const data = {
        pagina,
        limite
      };

  const esquema = Joi.object({
    pagina: Joi.number().integer().min(1).messages({
      "number.base": "La página debe ser un número",
      "number.integer": "La página debe ser un número entero",
      "number.min": "La página debe ser mayor o igual a 1",
    }),

    limite: Joi.number().integer().min(1).messages({
      "number.base": "El límite debe ser un número",
      "number.integer": "El límite debe ser un número entero",
      "number.min": "El límite debe ser mayor o igual a 1",
    }),
  });

  return esquema.validate(data, { abortEarly: false });
}
