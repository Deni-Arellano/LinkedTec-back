const usuarioService = require('../services/services_usuarios');
const { validarRegistroUsuario, validarConsultaUsuario } = require('../middlewares/validations/validaciones_usuarios');



/**
 * Crea un nuevo usuario en la base de datos.
 * @param {Object} req - Objeto de solicitud, contiene la información del usuario.
 * @param {Object} res - Objeto de respuesta, utilizado para enviar respuestas al cliente.
 */
const crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido_paterno, apellido_materno, correo, contraseña, fecha_nacimiento, telefono, sexo, biografia, role, imagen_usuario } = req.body;

    const {error} = await validarRegistroUsuario(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }


    // Llama al servicio de usuariospara crear un nuevo usuario
    const nuevoUsuario = await usuarioService.crearUsuario({
      nombre,
      apellido_paterno,
      apellido_materno,
      correo,
      contraseña,
      fecha_nacimiento,
      telefono,
      sexo,
      biografia,
      role,
      imagen_usuario
    });

    // Responde con el nuevo usuario creado
    res.status(201).json(nuevoUsuario);

  } catch (error) {
    // Manejo de errores
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene un usuario por su ID.
 * @param {Object} req - Objeto de solicitud que contiene el ID del usuario.
 * @param {Object} res - Objeto de respuesta utilizado para enviar la información del usuario.
 */
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params; 

    data = {
      id: id
    }

    const {error} = await validarConsultaUsuario(data);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
      
    }


    const usuario = await usuarioService.obtenerUsuarioPorId(id); // Llama al servicio para obtener el usuario
    res.status(200).json(usuario); // Responde con la información del usuario
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtiene todos los usuarios de la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta utilizado para enviar la lista de usuarios.
 */
const obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.obtenerTodosLosUsuarios(); // Llama al servicio para obtener todos los usuarios
    res.status(200).json(usuarios); // Responde con la lista de usuarios
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ error: error.message });
  }
};

// Exporta las funciones para usarlas en otras partes de la aplicación
module.exports = {
  crearUsuario,
  obtenerUsuarioPorId,
  obtenerTodosLosUsuarios
};