const postulacionServices = require('../services/services_postulaciones');
const Postulacion = require('../models/postulaciones');
const Estado = require('../models/estados'); // Modelo para la tabla estados
const Empleo = require('../models/empleos');
const Usuario = require('../models/usuarios');


//visulaicasion de usarios
const obtenerPostulacionesDeUsuario = async (req, res) => {
  const id_usuario = req.params.id; 
  const { page = 1, limit = 10 } = req.query; 
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Postulacion.findAndCountAll({
      where: { id_usuario },
      include: [
        {
          model: Estado,
          attributes: ['estado'], 
        },
        {
          model: Empleo,
          attributes: ['titulo', 'fecha_creacion', 'empresa'], 
        },
      ],
      limit: parseInt(limit), 
      offset: parseInt(offset),
    });

    const total_paginas = Math.ceil(count / limit);

   
    const postulaciones = rows.map((postulacion) => {
      const empleo = postulacion.Empleo || {}; 
      const estado = postulacion.Estado || {}; 

      return {
        id_postulacion: postulacion.id_postulacion,
        id_usuario: postulacion.id_usuario,
        titulo: empleo.titulo || 'Título no disponible',
        fecha: postulacion.fecha_creacion || 'Fecha no disponible',
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
      postulaciones, 
    });
  } catch (error) {
    console.error('Error al obtener las postulaciones:', error);
    return res.status(500).json({ message: 'Error al obtener las postulaciones' });
  }
};


const obtenerPostulacionCompleta = async (req, res) => {
  const { id_postulacion } = req.params;

  try {
    const postulacion = await Postulacion.findOne({
      where: { id_postulacion },
      include: [
        {
          model: Usuario,
          attributes: ['nombre', 'correo'],
        },
        {
          model: Empleo,
          attributes: [
            'id_empleo',
            'titulo',
            'empresa',
            'salario',
            'descripcion',
            'ubicacion',
            'nivel_de_ingles',
            'fecha_creacion',
          ],
        },
      ],
    });

    if (!postulacion) {
      return res.status(404).json({ message: 'Postulación no encontrada' });
    }
    return res.json({
      empleo: {
        id_empleo: postulacion.Empleo?.id_empleo || 'ID no disponible',
        titulo: postulacion.Empleo?.titulo || 'Título no disponible',
        empresa: postulacion.Empleo?.empresa || 'Empresa no disponible',
        salario: postulacion.Empleo?.salario || 'Salario no disponible',
        descripcion: postulacion.Empleo?.descripcion || 'Descripción no disponible',
        ubicacion: postulacion.Empleo?.ubicacion || 'Ubicación no disponible',
        nivel_de_ingles: postulacion.Empleo?.nivel_de_ingles || 'Nivel de inglés no disponible',
        fecha_creacion: postulacion.Empleo?.fecha_creacion || 'Fecha de creación no disponible',
      },
      usuario: {
        nombre: postulacion.Usuario?.nombre || 'Nombre no disponible',
        correo: postulacion.Usuario?.correo || 'Correo no disponible',
        descripcion_personal: postulacion.descripcion_personal || 'Descripción personal no disponible',
        cv: postulacion.cv || 'CV no disponible',
      },
    });
  } catch (error) {
    console.error('Error al obtener la postulación:', error);
    return res.status(500).json({ message: 'Error al obtener la postulación' });
  }
};

//visualizacion de reclutadores
const obtenerPostulantesPorEmpleoController = async (req, res) => {
  const { id_empleo } = req.params; // Obtener el ID del empleo desde los parámetros de la solicitud
  const { page = 1, limit = 10 } = req.query; // Obtener los parámetros de paginación (cambiado el límite a 2 como deseabas)

  // Calcular el desplazamiento (offset) para la paginación
  const offset = (page - 1) * limit;

  try {
    const postulaciones = await Postulacion.findAll({
      where: { id_empleo },
      include: [
        {
          model: Usuario,
          attributes: ['nombre', 'correo'], // Obtener nombre y correo del usuario
        },
        {
          model: Estado,
          attributes: ['estado'], // Obtener el estado de la postulación
        },
      ],
      limit: parseInt(limit, 10), // Limitar el número de resultados
      offset: parseInt(offset, 10), // Desplazar los resultados
    });

    const totalPostulaciones = await Postulacion.count({ where: { id_empleo } }); // Contar el total de postulaciones para este empleo

    // Calcular el total de páginas
    const total_paginas = Math.ceil(totalPostulaciones / limit);

    if (!postulaciones.length) {
      return res.json({
        total: totalPostulaciones,
        pagina: parseInt(page),
        limite: parseInt(limit),
        total_paginas,
        pagina_siguiente: {
          url: null,
          exists: false
        },
        pagina_anterior: {
          url: page > 1 ? `http://localhost:3000/postulaciones/empleo/${id_empleo}?page=${page - 1}&limit=${limit}` : null,
          exists: page > 1
        },
        postulaciones: [],
      });
    }

    // Estructurar la respuesta para incluir detalles específicos
    const resultados = postulaciones.map(postulacion => {
      return {
        nombre_usuario: postulacion.Usuario?.nombre || 'Nombre no disponible',
        correo_usuario: postulacion.Usuario?.correo || 'Correo no disponible',
        fecha_creacion: postulacion.fecha_creacion || 'Fecha no disponible',
        estado: postulacion.estado ? postulacion.estado.estado : 'Estado no disponible',
      };
    });

    // Construir la respuesta final
    const pagina_siguiente = {
      url: page < total_paginas ? `http://localhost:3000/postulaciones/empleo/${id_empleo}?page=${parseInt(page) + 1}&limit=${limit}` : null,
      exists: page < total_paginas,
    };

    const pagina_anterior = {
      url: page > 1 ? `http://localhost:3000/postulaciones/empleo/${id_empleo}?page=${page - 1}&limit=${limit}` : null,
      exists: page > 1,
    };

    return res.json({
      total: totalPostulaciones,
      pagina: parseInt(page),
      limite: parseInt(limit),
      total_paginas,
      pagina_siguiente,
      pagina_anterior,
      postulaciones: resultados,
    });
  } catch (error) {
    console.error('Error al obtener postulantes:', error);
    return res.status(500).json({ message: 'Error al obtener postulantes' });
  }
};


const { obtenerDetallesPostulantePorId } = require('../services/services_postulaciones'); 

const obtenerDetallesPostulanteController = async (req, res) => {
  const { id_empleo, id_usuario } = req.params; // Obtener el ID del empleo y del usuario desde los parámetros

  try {
    const postulacion = await obtenerDetallesPostulantePorId(id_empleo, id_usuario); // Llamar al servicio

    if (!postulacion) {
      return res.status(404).json({ message: 'No se encontró la postulación para este usuario y empleo' });
    }

    // Estructurar la respuesta para incluir todos los detalles necesarios
    const detallePostulante = {
      nombre_usuario: postulacion.Usuario.nombre,
      correo_usuario: postulacion.Usuario.correo,
      fecha_postulacion: postulacion.fecha_creacion || 'Fecha no disponible',
      estado: postulacion.estado ? postulacion.estado.estado : 'Estado no disponible',
      descripcion: postulacion.descripcion_personal || 'Descripción no disponible',
      cv: postulacion.cv || 'CV no disponible',
    };

    // Devolver la información del postulante
    return res.json(detallePostulante);
  } catch (error) {
    console.error('Error al obtener detalles del postulante:', error);
    return res.status(500).json({ message: 'Error al obtener detalles del postulante' });
  }
};

const crearPostulacion = async (req, res) => {

  try {

    const informacionPostulacion = req.body;
    const nuevaPostulacion = await postulacionServices.crearPostulacion(informacionPostulacion);
    return res.status(201).json(nuevaPostulacion);

  }catch (error) {

    res.status(500).json({ error: "Error al crear la postulación" });

  }

};





  

module.exports = {
    obtenerPostulacionesDeUsuario,
    obtenerPostulacionCompleta,
    obtenerPostulantesPorEmpleoController,
    obtenerDetallesPostulanteController,
    crearPostulacion
};