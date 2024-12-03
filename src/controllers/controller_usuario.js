const usuarioService = require('../services/services_usuarios');
const { validarRegistroUsuario, validarUsuarioExistente, validarCorreoExistente, validarUsuariosExistentes } = require('../middlewares/validations/validaciones_usuarios');
const {validarImagenExistente} = require('../middlewares/validations/validaciones_imagenes');
const { deleteUsuario } = require('../services/services_usuarios');


/**
 * Crea un nuevo usuario en la base de datos.
 * @param {Object} req - Objeto de solicitud, contiene la información del usuario.
 * @param {Object} res - Objeto de respuesta, utilizado para enviar respuestas al cliente.
 */
const crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido_paterno, apellido_materno, correo, contraseña, fecha_nacimiento, telefono, sexo, biografia, role, imagen_usuario } = req.body;

    const { error } = await validarRegistroUsuario(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }


    await validarCorreoExistente(correo);
    //await validarImagenExistente(imagen_usuario);
    


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

    res.status(201).json(nuevoUsuario);

  } catch (error) {

    if (error.name === 'EmailExistsError') {
      return res.status(400).json({ error: error.message });

    } else if (error.name === 'ImageNotFoundError') {
      return res.status(404).json({ error: error.message });
    

    } else{
      res.status(500).json({ error: error.message});

    }
    
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

    await validarUsuarioExistente(id);

    const usuario = await usuarioService.obtenerUsuarioPorId(id); 
    res.status(200).json(usuario); 

  } catch (error) {

    if (error.name === 'UserNotFoundError') {
      return res.status(404).json({ error: error.message });
    }


    res.status(500).json({ error: error.message });
  }
};



const cambiarImagenUsuario = async (req, res) => {

    try {
        const { id } = req.body;
        const { imagen_nueva } = req.body;
        const {antigua_imagen} = req.body;



        const resultado = await usuarioService.cambiarImagenPerfil(id, imagen_nueva, antigua_imagen);
        res.status(200).json(resultado);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}




/**
 * Obtiene todos los usuarios de la base de datos.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta utilizado para enviar la lista de usuarios.
 */
const obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.obtenerTodosLosUsuarios(); // Llama al servicio para obtener todos los usuarios

    await validarUsuariosExistentes(usuarios);
    


    res.status(200).json(usuarios); // Responde con la lista de usuarios
  } catch (error) {

    if (error.name === 'UserNotFoundError') {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
};



const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  const { contraseña } = req.query; 


  try {
      const resultado = await deleteUsuario(id, contraseña);
      res.status(200).json(resultado);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

const obtenerImagenUsuario = async (req, res) => {


  try{
      
      const { id } = req.params;
  
      await validarUsuarioExistente(id);
  
      const imagen = await usuarioService.obtenerImagenUsuario(id);
      res.status(200).json(imagen[0].imagen_usuario);

  }catch (error) {
    res.status(500).json({ error: error.message });
  }

}





module.exports = {
  crearUsuario,
  obtenerUsuarioPorId,
  obtenerTodosLosUsuarios,
  eliminarUsuario,
  obtenerImagenUsuario,
    cambiarImagenUsuario
};