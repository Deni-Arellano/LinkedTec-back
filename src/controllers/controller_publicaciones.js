const {
  crearPublicacionService,
  obtenerTodasLasPublicacionesService,
  obtenerPublicacionesPorUsuarioService,
  obtenerPublicacionPorIdService,
  actualizarPublicacionCompletaService,
  actualizarPublicacionParcialService,
  eliminarPublicacionService
} = require('../services/services_publicaciones'); // Importa los servicios correspondientes

const { validarPublicacion,validarPublicacionPorUsuario, validarPublicacionesExistentes, validarPublicacionExistente, validarPublicacionParcial } = require('../middlewares/validations/validaciones_publicaciones');
const { validarUsuarioExistente } = require('../middlewares/validations/validaciones_usuarios');
const {validarImagenExistente} = require('../middlewares/validations/validaciones_imagenes');

/**
 * 
 * Crea una nueva publicación.
 * @param {Object} req - El objeto de la solicitud HTTP.
 * @param {Object} res - El objeto de la respuesta HTTP.
 * @returns {Promise<void>} - Responde con la nueva publicación o un error.
 */
const crearPublicacion = async (req, res) => {
  try {

    const { error } = await validarPublicacion(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });

    }

    await validarUsuarioExistente(req.body.id_usuario);
    //await validarImagenExistente(req.body.imagen);


    const nuevaPublicacion = await crearPublicacionService(req.body); 
    res.status(201).json(nuevaPublicacion); 
    
  } catch (error) {

    if (error.name === 'UserNotFoundError') {
      return res.status(404).json({ error: error.message });

    } else if (error.name === 'ImageNotFoundError') {
      return res.status(404).json({ error: error.message });

    } else if (error.name === 'FileNotFoundError') {
      return res.status(404).json({ error: error.message });

    } else {
      console.error(error);
      return res.status(500).json({ mensaje: 'Error al crear la publicación' }); 

    }

  }
};

/**
 * Obtiene todas las publicaciones de un usuario específico.
 * @param {Object} req - El objeto de la solicitud HTTP.
 * @param {Object} res - El objeto de la respuesta HTTP.
 * @returns {Promise<void>} - Responde con las publicaciones del usuario o un error.
 */
const obtenerPublicacionesPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params; // Extrae el ID del usuario de los parámetros
    const { pagina = 1, limite = 10 } = req.query;

    await validarUsuarioExistente(id_usuario);


    const publicaciones = await obtenerPublicacionesPorUsuarioService(id_usuario, pagina, limite); // Llama al servicio para obtener las publicaciones
    
    await validarPublicacionesExistentes(publicaciones);//Valida si existen publicaciones
    
    res.status(200).json(publicaciones); // Responde con las publicaciones


  } catch (error) {

    if (error.name === 'UserNotFoundError') {
      return res.status(404).json({ error: error.message });

    } else if (error.name === 'PublicationNotFoundError') {
      return res.status(404).json({ error: error.message });

    }else {
      return res.status(500).json({ mensaje: 'Error al obtener las publicaciones del usuario' }); 

    }
    
  }
};

/**
 * Obtiene una publicación específica por su ID.
 * @param {Object} req - El objeto de la solicitud HTTP.
 * @param {Object} res - El objeto de la respuesta HTTP.
 * @returns {Promise<void>} - Responde con la publicación o un error.
 */
const obtenerPublicacionPorId = async (req, res) => {
  try {
    const { id_publicacion } = req.params; 

    await validarPublicacionExistente(id_publicacion);

    const publicacion = await obtenerPublicacionPorIdService(id_publicacion);

    res.status(200).json(publicacion); 


    
  } catch (error) {
    if (error.name === 'PublicationNotFoundError') {
      return res.status(404).json({ error: error.message });

    } else {
      return res.status(500).json({ mensaje: 'Error al obtener la publicación' }); 

    }
  }

};

/**
 * Obtiene todas las publicaciones.
 * @param {Object} req - El objeto de la solicitud HTTP.
 * @param {Object} res - El objeto de la respuesta HTTP.
 * @returns {Promise<void>} - Responde con todas las publicaciones o un error.
 */
const obtenerTodasLasPublicaciones = async (req, res) => {
  try {
    const pagina = req.query.pagina || 1;
    const limite = req.query.limite || 10;
    const publicaciones = await obtenerTodasLasPublicacionesService(pagina, limite); 

    await validarPublicacionesExistentes(publicaciones);

    res.status(200).json(publicaciones);


  } catch (error) {
    if (error.name === 'PublicationNotFoundError') {
      return res.status(404).json({ error: error.message });

    } else {
      res.status(500).json({ mensaje: 'Error al obtener las publicaciones' }); 

    }

  }
};


//PENDIENTE DE REVISAR CON EL EQUIPO
/**
 * Controlador para actualizar completamente una publicación (PUT).
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
const actualizarPublicacionCompleta = async (req, res) => {
  try {
    const { id } = req.params;
    const datosPublicacion = req.body;

    const publicacionActualizada = await actualizarPublicacionCompletaService(id, datosPublicacion);

    if (!publicacionActualizada) {
      return res.status(404).json({ mensaje: 'Publicación no encontrada' });
    }

    res.json(publicacionActualizada);
  } catch (error) {
    if (error.message === 'Todos los campos son requeridos para una actualización completa') {
      res.status(400).json({ mensaje: error.message });
    } else {
      res.status(500).json({ mensaje: 'Error al actualizar la publicación', error: error.message });
    }
  }
};




/**
 * Controlador para actualizar parcialmente una publicación (PATCH).
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 */
const actualizarPublicacionParcial = async (req, res) => {
  try {
    const { id } = req.params;
    const datosPublicacion = req.body;

    await validarPublicacionExistente(id);


    const { error } = await validarPublicacionParcial(datosPublicacion);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    //await validarImagenExistente(datosPublicacion.imagen);


    const publicacionActualizada = await actualizarPublicacionParcialService(id, datosPublicacion);



    res.json(publicacionActualizada);

  } catch (error) {

    if (error.name === 'PublicationNotFoundError') {
      return res.status(404).json({ mensaje: error.message });

    } else if (error.name === 'FileNotFoundError') {
      return res.status(404).json({ mensaje: error.message });

    } else {
      console.log(error);
      res.status(500).json({ mensaje: 'Error al actualizar la publicación', error: error.message });

    }




  }
};

const eliminarPublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    
    await validarPublicacionExistente(id);

    const publicacionEliminada = await eliminarPublicacionService(id);

    if (!publicacionEliminada) {
      return res.status(404).json({ mensaje: 'Publicación no encontrada' });
    }

    res.json({ mensaje: 'Publicación eliminada exitosamente' });

  } catch (error) {
    if (error.name === 'PublicationNotFoundError') {
      return res.status(404).json({ mensaje: error.message });

    }
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar la publicación', error: error.message });

  }
};

// Exporta las funciones para usarlas en otras partes de la aplicación
module.exports = {
  crearPublicacion,
  obtenerPublicacionesPorUsuario,
  obtenerPublicacionPorId,
  obtenerTodasLasPublicaciones,
  actualizarPublicacionCompleta,
  actualizarPublicacionParcial,
  eliminarPublicacion
};
