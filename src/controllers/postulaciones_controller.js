const postulacionServices = require('../services/services_postulaciones');
const Postulacion = require('../models/postulaciones');
const Estado = require('../models/estados'); 
const Empleo = require('../models/empleos');
const Usuario = require('../models/usuarios');

//importacion de middlewares de validacion
const validarUsuario = require('../middlewares/validations/validaciones_usuarios');
const validarEmpleo = require('../middlewares/validations/validaciones_empleos');
const validarpostulacion = require('../middlewares/validations/validaciones_postulaciones');



//visulaicasion de usarios
const obtenerPostulacionesDeUsuario = async (req, res) => {
  const id_usuario = req.params.id; 
  const { pagina= 1, limite = 10 } = req.query; 
  const offset = (pagina- 1) * limite;

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
      limit: parseInt(limite), 
      offset: parseInt(offset),
    });

    const total_paginas = Math.ceil(count / limite);

   
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
      url: pagina< total_paginas ? `http://localhost:3000/postulaciones/${id_usuario}?pagina=${parseInt(pagina) + 1}&limite=${limite}` : null,
      exists: pagina< total_paginas,
    };

    const pagina_anterior = {
      url: pagina> 1 ? `http://localhost:3000/postulaciones/${id_usuario}?pagina=${pagina- 1}&limite=${limite}` : null,
      exists: pagina> 1,
    };

    return res.json({
      total: count,
      pagina: parseInt(pagina),
      limite: parseInt(limite),
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
  const { id_empleo } = req.params; 
  const { pagina= 1, limite = 10 } = req.query; 

  
  const offset = (pagina- 1) * limite;

  try {
    const postulaciones = await Postulacion.findAll({
      where: { id_empleo },
      include: [
        {
          model: Usuario,
          attributes: ['nombre', 'correo'], 
        },
        {
          model: Estado,
          attributes: ['estado'], 
        },
      ],
      limit: parseInt(limite, 10), 
      offset: parseInt(offset, 10), 
    });

    const totalPostulaciones = await Postulacion.count({ where: { id_empleo } }); 


    const total_paginas = Math.ceil(totalPostulaciones / limite);

    if (!postulaciones.length) {
      return res.json({
        total: totalPostulaciones,
        pagina: parseInt(pagina),
        limitee: parseInt(limite),
        total_paginas,
        pagina_siguiente: {
          url: null,
          exists: false
        },
        pagina_anterior: {
          url: pagina> 1 ? `http://localhost:3000/postulaciones/empleo/${id_empleo}?pagina=${pagina- 1}&limite=${limite}` : null,
          exists: pagina> 1
        },
        postulaciones: [],
      });
    }


    const resultados = postulaciones.map(postulacion => {
      return {
        nombre_usuario: postulacion.Usuario?.nombre || 'Nombre no disponible',
        correo_usuario: postulacion.Usuario?.correo || 'Correo no disponible',
        fecha_creacion: postulacion.fecha_creacion || 'Fecha no disponible',
        estado: postulacion.estado ? postulacion.estado.estado : 'Estado no disponible',
      };
    });

   
    const pagina_siguiente = {
      url: pagina< total_paginas ? `http://localhost:3000/postulaciones/empleo/${id_empleo}?pagina=${parseInt(pagina) + 1}&limite=${limite}` : null,
      exists: pagina< total_paginas,
    };

    const pagina_anterior = {
      url: pagina> 1 ? `http://localhost:3000/postulaciones/empleo/${id_empleo}?pagina=${pagina- 1}&limite=${limite}` : null,
      exists: pagina> 1,
    };

    return res.json({
      total: totalPostulaciones,
      pagina: parseInt(pagina),
      limite: parseInt(limite),
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
  const { id_empleo, id_usuario } = req.params;

  try {
    const postulacion = await obtenerDetallesPostulantePorId(id_empleo, id_usuario); 

    if (!postulacion) {
      return res.status(404).json({ message: 'No se encontró la postulación para este usuario y empleo' });
    }

    
    const detallePostulante = {
      nombre_usuario: postulacion.Usuario.nombre,
      correo_usuario: postulacion.Usuario.correo,
      fecha_postulacion: postulacion.fecha_creacion || 'Fecha no disponible',
      estado: postulacion.estado ? postulacion.estado.estado : 'Estado no disponible',
      descripcion: postulacion.descripcion_personal || 'Descripción no disponible',
      cv: postulacion.cv || 'CV no disponible',
    };

   
    return res.json(detallePostulante);
  } catch (error) {
    console.error('Error al obtener detalles del postulante:', error);
    return res.status(500).json({ message: 'Error al obtener detalles del postulante' });
  }
};

const crearPostulacion = async (req, res) => {

  try {

    const informacionPostulacion = req.body;

     
    const {error} = await validarpostulacion.validarCamposCrearPostulacion(informacionPostulacion);
    if (error) {
      return res.status(400).json({"error": error.details[0].message});
    }


    //Validaciones con metodos y excepciones especificos
    await validarUsuario.validarUsuarioExistente(informacionPostulacion.id_usuario);
    await validarEmpleo.verificarEmpleoPorId(informacionPostulacion.id_empleo);
    
    //await validarpostulacion.validarRecursoExistente(informacionPostulacion.cv);

    const nuevaPostulacion = await postulacionServices.crearPostulacion(informacionPostulacion);

    return res.status(201).json(nuevaPostulacion);

  }catch (error) {

    if (error.name == 'UserNotFoundError') {
      return res.status(404).json({ error: error.message });

    } else if (error.name == 'EmpleoNotFoundError') {
      return res.status(404).json({ error: error.message });

    } else if (error.name == 'ResourceNotFoundError') {
      return res.status(404).json({ error: error.message });

    }

    res.status(500).json({ error: "Error al crear la postulación", message: error.message });

  }

};





  

module.exports = {
    obtenerPostulacionesDeUsuario,
    obtenerPostulacionCompleta,
    obtenerPostulantesPorEmpleoController,
    obtenerDetallesPostulanteController,
    crearPostulacion
};