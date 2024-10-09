const { crearReclutadorServicio, obtenerReclutadorServicio, obtenerTodosReclutadoresServicio, obtenerTodosUsuariosYReclutadores,obtenerReclutadorDetalladoPorIdServicio, obtenerReclutadorPorIdServicio, actualizarReclutadorServicio } = require('../services/services_reclutadores');
const { validarReclutador } = require('../middlewares/validations/validaciones_reclutadores');
const {  validarUsuarioExistente, validarCorreoExistente,validarUsuarioEnUso, validarUsuariosExistentes  } = require('../middlewares/validations/validaciones_usuarios');

/**
 * Controlador para crear un reclutador.
 * @async
 * @function crearReclutador
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con el reclutador creado o un error.
 */
const crearReclutador = async (req, res) => {
  const { usuario, reclutador } = req.body;

  // Validamos el objeto reclutador primero
  const { error } = validarReclutador(reclutador);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }


  try {
    // Validamos que el correo y el usuario no existan antes de continuar
    console.log(usuario.id);
    await validarCorreoExistente(usuario.correo);
    

    // Intentamos crear el reclutador si no hubo errores en las validaciones
    const result = await crearReclutadorServicio(usuario, reclutador);
    return res.status(201).json(result);

  } catch (error) {
    // Si el correo ya está en uso
    if (error.name === 'EmailExistsError') {
      return res.status(409).json({ message: 'El correo ya está en uso' });
    }
    // Si el usuario ya existe

    // Otros errores
    console.error('Error al crear reclutador:', error);
    return res.status(500).json({ message: 'Error al crear reclutador', error: error.message });
  }
};


/**
 * Controlador para obtener un reclutador por su ID.
 * @async
 * @function obtenerReclutador
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con los datos del reclutador o un error.
 */
const obtenerReclutador = async (req, res) => {
  const { id } = req.params;

  try {
    await validarUsuarioExistente(id);
    const reclutador = await obtenerReclutadorServicio(id);
    
   

    if (reclutador) {
      res.status(200).json({
        nombre: reclutador.Usuario.nombre,
        apellido_paterno: reclutador.Usuario.apellido_paterno,
        apellido_materno: reclutador.Usuario.apellido_materno,
        role: reclutador.Usuario.role,
        correo: reclutador.Usuario.correo,
        telefono: reclutador.Usuario.telefono,
        fecha_nacimiento: reclutador.Usuario.fecha_nacimiento,
        sexo: reclutador.Usuario.sexo,
        nombre_empresa: reclutador.nombre_empresa,
        giro: reclutador.giro
      });
    } else {
      res.status(404).json({ message: 'Reclutador no encontrado' });
    }
  } catch (error) {
    if (error.name === 'UserNotFoundError') {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    console.error('Error al obtener reclutador:', error);
    res.status(500).json({ message: 'Error al obtener reclutador', error: error.message });
  }
};

/**
 * Controlador para obtener todos los reclutadores.
 * @async
 * @function obtenerTodosReclutadores
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con la lista de reclutadores o un error.
 */
const obtenerTodosReclutadores = async (req, res) => {
  try {
    const reclutadores = await obtenerTodosReclutadoresServicio(); // Asegúrate de que esta función devuelva un arreglo

    // Validamos que los reclutadores existan
    await validarUsuariosExistentes(reclutadores);

    // Respuesta exitosa con los reclutadores obtenidos
    res.status(200).json(reclutadores);
  } catch (error) {
    if (error.name === 'UserNotFoundError') {
      return res.status(404).json({ message: 'Reclutadores no encontrados' });
    }

    console.error('Error al obtener todos los reclutadores:', error);
    res.status(500).json({ message: 'Error al obtener reclutadores', error: error.message, stack: error.stack });
  }
};


const obtenerUsuariosYReclutadores = async (req, res) => {
  try {
    const reclutadores = await obtenerTodosUsuariosYReclutadores();
    console.log('Reclutadores obtenidos:', reclutadores);

    await validarUsuariosExistentes(reclutadores);

    const response = reclutadores.map(reclutador => {
      const usuario = reclutador.Usuario || {};
      
      return {
        id: usuario.id || null,
        nombre: usuario.nombre || '',
        apellido_paterno: usuario.apellido_paterno || '',
        apellido_materno: usuario.apellido_materno || '',
        correo: usuario.correo || '',
        contraseña: usuario.contraseña || '',
        fecha_nacimiento: usuario.fecha_nacimiento || null,
        telefono: usuario.telefono || '',
        sexo: usuario.sexo || '',
        biografia: usuario.biografia || '',
        role: usuario.role || '',
        imagen_usuario: usuario.imagen_usuario || '',
        nombre_empresa: reclutador.nombre_empresa || '',
        sede: reclutador.sede || '',
        giro: reclutador.giro || ''
      };
    });

    res.status(200).json(response);
  } catch (error) {
    if (error.name === 'UserNotFoundError') {
      return res.status(404).json({ message: 'Usuarios y reclutadores no encontrados' });
    }

    console.error('Error al obtener usuarios y reclutadores:', error);
    res.status(500).json({ message: 'Error al obtener usuarios y reclutadores', error: error.message, stack: error.stack });
  }
};

//insomnia Obtener rol epecifico
const obtenerReclutadorPorId = async (req, res) => {
  const { id } = req.params;

  try {
    
    await validarUsuarioExistente(id);
    
    // Obtiene el reclutador por ID
    const reclutador = await obtenerReclutadorPorIdServicio(id);

    // Si no lanza error, asume que se encontró el reclutador y responde con los datos
    res.status(200).json({
      id: reclutador.id,
      nombre_empresa: reclutador.nombre_empresa,
      sede: reclutador.sede,
      giro: reclutador.giro
    });

  } catch (error) {

    // Manejar errores específicos, como que el reclutador no se encuentre
    if (error.name === 'UserNotFoundError') {
      return res.status(404).json({ message: 'Reclutador no encontrado' });
     
    }
    else{
      
      res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
    
  }
};



// en insomnia Obtener usuario espeficio con rol
const obtenerReclutadorDetalladoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica si el usuario existe (esta función debería lanzar un error si no existe)
    await validarUsuarioExistente(id);

    // Obtiene los detalles del reclutador, si no existe debería lanzar un error
    const reclutador = await obtenerReclutadorDetalladoPorIdServicio(id);
    console.log(id);
    if (!reclutador || !reclutador.Usuario) {
      return res.status(404).json({ message: 'Reclutador o usuario no encontrado' });
    }

    const response = {
      id: reclutador.Usuario.id,
      nombre: reclutador.Usuario.nombre,
      apellido_paterno: reclutador.Usuario.apellido_paterno,
      apellido_materno: reclutador.Usuario.apellido_materno,
      correo: reclutador.Usuario.correo,
      contraseña: reclutador.Usuario.contraseña,
      fecha_nacimiento: reclutador.Usuario.fecha_nacimiento,
      telefono: reclutador.Usuario.telefono,
      sexo: reclutador.Usuario.sexo,
      biografia: reclutador.Usuario.biografia,
      role: reclutador.Usuario.role,
      imagen_usuario: reclutador.Usuario.imagen_usuario,
      nombre_empresa: reclutador.nombre_empresa,
      sede: reclutador.sede,
      giro: reclutador.giro
    };

    // Respuesta exitosa con los detalles del reclutador
    res.status(200).json(response);
  } catch (error) {
    // Si el error es específico de que el usuario no fue encontrado, manejarlo aquí
    if (error.name === 'UserNotFoundError') {
      return res.status(404).json({ message: 'Reclutador no encontrado' });
    }

    // Para otros errores, devolver un 500
    console.error('Error al obtener reclutador por ID:', error);
    res.status(500).json({ message: 'Error al obtener reclutador', error: error.message });
  }
};

const actualizarReclutador = async (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;

  try {
    const reclutadorActualizado = await actualizarReclutadorServicio(id, datosActualizados);
    res.status(200).json({
      message: 'Reclutador actualizado exitosamente',
      reclutador: reclutadorActualizado
    });
  } catch (error) {
    console.error('Error al actualizar reclutador:', error);
    res.status(500).json({ message: 'Error al actualizar reclutador', error: error.message });
  }
};



module.exports = {
  crearReclutador,
  obtenerReclutador,
  obtenerTodosReclutadores,
  obtenerUsuariosYReclutadores,
  obtenerReclutadorPorId,
  obtenerReclutadorDetalladoPorId,
  actualizarReclutador
};