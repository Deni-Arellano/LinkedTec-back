// src/controllers/egresados_controller.js
const egresadosService = require('../services/services_egresados');
const usuarioService = require('../services/services_usuarios'); // Importar el servicio de usuarios
const Egresado = require('../models/egresados');
const Usuario = require('../models/usuarios');
const db = require('../config/database');

// Obtener todos los egresados
exports.getAllEgresados = async (req, res) => {
  try {
    const [egresados] = await db.query(`
      SELECT eg.id, eg.carrera, eg.año_graduacion, eg.puesto, 
             u.nombre, u.apellido_paterno, u.apellido_materno, u.correo
      FROM egresados eg
      JOIN usuarios u ON eg.id = u.id
    `);
    return res.json(egresados);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los egresados', error: error.message });
  }
};

// Obtener un egresado por ID
exports.getEgresadoById = async (req, res) => {
  const { id } = req.params; // Obtener el ID de los parámetros de la solicitud

  try {
    const egresado = await Egresado.findByPk(id); // Buscar el egresado por ID
    if (!egresado) {
      return res.status(404).json({ message: 'Egresado no encontrado' });
    }

    const usuario = await usuarioService.obtenerUsuarioPorId(id); // Obtener el usuario asociado
    const perfil = {
      nombre: usuario.nombre,
      apellido_paterno: usuario.apellido_paterno,
      apellido_materno: usuario.apellido_materno,
      rol: usuario.role,
      carrera: egresado.carrera,
      biografia: usuario.biografia,
      telefono: usuario.telefono,
      correo: usuario.correo,
      fecha_nacimiento: usuario.fecha_nacimiento,
      sexo: usuario.sexo,
    };

    return res.json(perfil); // Devolver la información del perfil
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener el egresado', error: error.message });
  }
};

// Crear un nuevo egresado y usuario desde un JSON anidado
exports.createEgresado = async (req, res) => {
  const { usuario, egresado } = req.body;

  try {
    // Verificar si el correo ya existe
    const existingUser = await Usuario.findOne({ where: { correo: usuario.correo } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está en uso.' });
    }

    // Crear un nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre: usuario.nombre,
      apellido_paterno: usuario.apellido_paterno,
      apellido_materno: usuario.apellido_materno,
      correo: usuario.correo,
      contraseña: usuario.contraseña,
      fecha_nacimiento: usuario.fecha_nacimiento,
      telefono: usuario.telefono,
      sexo: usuario.sexo,
      biografia: usuario.biografia,
      role: usuario.role,
      imagen_usuario: usuario.imagen_usuario
    });

    // Crear un nuevo egresado asociado al nuevo usuario
    const nuevoEgresado = await Egresado.create({
      id: nuevoUsuario.id, // Usa el ID del usuario recién creado
      carrera: egresado.carrera,
      año_graduacion: egresado.año_graduacion,
      puesto: egresado.puesto
    });

    res.status(201).json({
      message: 'Egresado y usuario creados exitosamente',
      usuario: nuevoUsuario,
      egresado: nuevoEgresado
    });
  } catch (error) {
    console.error('Error al crear egresado y usuario:', error);
    res.status(500).json({ message: 'Error al crear egresado y usuario', error: error.message });
  }
};
