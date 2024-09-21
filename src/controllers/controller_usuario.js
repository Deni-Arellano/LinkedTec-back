// controllers/usuarioController.js
const usuarioService = require('../services/services_usuarios');

const crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido_paterno, apellido_materno, correo, contraseña, fecha_nacimiento, telefono, sexo, biografia, role, imagen_usuario } = req.body;
    
    // Aquí puedes añadir validaciones antes de continuar
    if (!nombre || !apellido_paterno || !correo || !contraseña || !role) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    
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
    res.status(500).json({ error: error.message });
  }
};


const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await usuarioService.obtenerUsuarioPorId(id);
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerTodosLosUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.obtenerTodosLosUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  crearUsuario,
  obtenerUsuarioPorId,
  obtenerTodosLosUsuarios
};
