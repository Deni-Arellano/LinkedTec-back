const postulacionServices = require('../services/services_postulaciones');
const {validarPostulacionExistente}=require('../middlewares/validations/validaciones_postulaciones');
const {validarUsuarioExistente}=require('../middlewares/validations/validaciones_usuarios');
const {validarEmpleoNoEncontrado}=require('../middlewares/validations/validaciones_empleos');


//importacion de middlewares de validacion
const validarUsuario = require('../middlewares/validations/validaciones_usuarios');
const validarEmpleo = require('../middlewares/validations/validaciones_empleos');
//visulaicasion de usarios
const obtenerPostulacionesDeUsuario = async (req, res) => {
  const id_usuario = req.params.id; 
  const { pagina = 1, limite = 10 } = req.query; 

  try {
    const { total, total_paginas, postulaciones } = await postulacionServices.obtenerPostulacionesDeUsuarioService(id_usuario, pagina, limite);
    await validarUsuarioExistente(id_usuario);

   
    const pagina_siguiente = {
      url: pagina < total_paginas ? `http://localhost:3000/postulaciones/${id_usuario}?pagina=${parseInt(pagina) + 1}&limite=${limite}` : null,
      exists: pagina < total_paginas,
    };

    const pagina_anterior = {
      url: pagina > 1 ? `http://localhost:3000/postulaciones/${id_usuario}?pagina=${pagina - 1}&limite=${limite}` : null,
      exists: pagina > 1,
    };

    return res.json({
      total,
      pagina: parseInt(pagina),
      limite: parseInt(limite),
      total_paginas,
      pagina_siguiente,
      pagina_anterior,
      postulaciones,
    });
  } catch (error) {
    if(error.name==='UserNotFoundError'){
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    console.error('Error al obtener las postulaciones:', error);
    return res.status(500).json({ message: 'Error al obtener las postulaciones' });
  }
};



const obtenerPostulacionCompleta = async (req, res) => {
  const { id_postulacion } = req.params;

  try {
    const postulacion = await postulacionServices.obtenerPostulacionCompletaService(id_postulacion);
    await validarPostulacionExistente(id_postulacion);

    return res.json(postulacion);
  } catch (error) {
    if(error.name==='PostulacionNotFoundError'){
      return res.status(404).json({ message: 'Postulación no encontrada' });
    }
    console.error('Error al obtener la postulación:', error);
    return res.status(500).json({ message: 'Error al obtener la postulación' });
  }
};


//visualizacion de reclutadores
const obtenerPostulantesPorEmpleoController = async (req, res) => {
  const { id_empleo } = req.params;
  const { pagina = 1, limite = 10 } = req.query;

  try {
    const { totalPostulaciones, total_paginas, resultados } = await postulacionServices.obtenerPostulantesPorEmpleoService(id_empleo, pagina, limite);

    const pagina_siguiente = {
      url: pagina < total_paginas ? `http://localhost:3000/postulaciones/empleo/${id_empleo}?pagina=${parseInt(pagina) + 1}&limite=${limite}` : null,
      exists: pagina < total_paginas,
    };

    const pagina_anterior = {
      url: pagina > 1 ? `http://localhost:3000/postulaciones/empleo/${id_empleo}?pagina=${pagina - 1}&limite=${limite}` : null,
      exists: pagina > 1,
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

const obtenerDetallesPostulanteController = async (req, res) => {
  const { id_empleo, id_usuario } = req.params;

  try {
    const detallePostulante = await postulacionServices.obtenerDetallesPostulantePorId(id_empleo, id_usuario); 
    await validarUsuarioExistente(id_usuario);

    if (!detallePostulante) {
      return res.status(404).json({ message: 'No se encontró la postulación para este usuario y empleo' });
    }

    return res.json(detallePostulante);
  } catch (error) {
    if(error.name==='UserNotFoundError'){
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    console.error('Error al obtener detalles del postulante:', error);
    return res.status(500).json({ message: 'Error al obtener detalles del postulante' });
  }
};



const crearPostulacion = async (req, res) => {

  try {

    const informacionPostulacion = req.body;

    if (informacionPostulacion.descripcion_personal.length > 500) {
      res.status(400).json({ error: "La descripción personal no puede tener más de 500 caracteres" });
    } else if (informacionPostulacion.descripcion_personal.length === 0) {
      res.status(400).json({ error: "La descripción personal no puede estar vacía" });
    }


    //Validaciones con metodos y excepciones especificos
    await validarUsuario.validarUsuarioExistente(informacionPostulacion.id_usuario);
    //await validarEmpleo.validarEmpleoNoEncontrado(informacionPostulacion.id_empleo);

    if (informacionPostulacion.cv === null) {
      res.status(400).json({ error: "El campo CV es requerido" });
    }

    
    const nuevaPostulacion = await postulacionServices.crearPostulacion(informacionPostulacion);

    return res.status(201).json(nuevaPostulacion);

  }catch (error) {

    if (error.name == 'UserNotFoundError') {
      return res.status(404).json({ error: error.message });
    } else if (error.name == 'EmpleoNotFoundError') {
      return res.status(404).json({ error: error.message });
    }

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