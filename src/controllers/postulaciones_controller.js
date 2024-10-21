const {} = require('../services/services_postulaciones');
const Postulacion = require('../models/postulaciones');
const Estado = require('../models/estados'); 
const Empleo = require('../models/empleos');



const obtenerPostulacionesDeUsuario = async (req, res) => {
  const id_usuario = req.params.id; // ID del usuario
  const { page = 1, limit = 10 } = req.query; // Parámetros de paginación
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Postulacion.findAndCountAll({
      where: { id_usuario },
      include: [
        {
          model: Estado,
          attributes: ['estado'], // Solo queremos el nombre del estado
        },
        {
          model: Empleo,
          attributes: ['titulo', 'fecha_creacion', 'empresa'], // Campos que deseas incluir de la tabla Empleo
        },
      ],
      limit: parseInt(limit), // Limitar el número de resultados
      offset: parseInt(offset), // Desplazamiento para la paginación
    });

    const total_paginas = Math.ceil(count / limit);

    // Verificar que los datos existen antes de acceder a ellos
    const postulaciones = rows.map((postulacion) => {
      const empleo = postulacion.Empleo || {}; // Asegurarse de que Empleo existe
      const estado = postulacion.Estado || {}; // Asegurarse de que Estado existe

      return {
        id_postulacion: postulacion.id_postulacion,
        id_usuario: postulacion.id_usuario,
        titulo: empleo.titulo || 'Título no disponible',
        fecha: empleo.fecha_creacion || 'Fecha no disponible',
        empresa: empleo.empresa || 'Empresa no disponible', 
        estado: postulacion.estado ? postulacion.estado.estado : 'Estado no disponible',
      };
    });

    const pagina_siguiente = {
      url: page < total_paginas ? `http://localhost:3000/postulaciones/${id_usuario}?page=${parseInt(page) + 1}&limit=${limit}` : null,
      exists: page < total_paginas,
    };

    const pagina_anterior = {
      url: page > 1 ? `http://localhost:3000/postulaciones/${id_usuario}?page=${page - 1}&limit=${limit}` : null,
      exists: page > 1,
    };

    return res.json({
      total: count,
      pagina: parseInt(page),
      limite: parseInt(limit),
      total_paginas,
      pagina_siguiente,
      pagina_anterior,
      postulaciones, // Resultado de las postulaciones
    });
  } catch (error) {
    console.error('Error al obtener las postulaciones:', error);
    return res.status(500).json({ message: 'Error al obtener las postulaciones' });
  }
};


module.exports = {
    obtenerPostulacionesDeUsuario
};


