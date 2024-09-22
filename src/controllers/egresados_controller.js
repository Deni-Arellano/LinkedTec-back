// src/controllers/egresados_controller.js
const egresadosService = require('../services/services_egresados');
const usuarioService = require('../services/services_usuarios');
const Egresado = require('../models/egresados');
const Usuario = require('../models/usuarios');
const db = require('../config/database');

/**
 * @async
 * Controlador para obtener todos los egresados.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con los egresados o un error.
 */
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

/**
 * @async
 * Controlador para obtener un egresado por ID.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con los datos del egresado o un error.
 */
exports.getEgresadoById = async (req, res) => {
  const { id } = req.params;

  try {
    const egresado = await Egresado.findByPk(id);
    if (!egresado) {
      return res.status(404).json({ message: 'Egresado no encontrado' });
    }

    const usuario = await usuarioService.obtenerUsuarioPorId(id);
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

    return res.json(perfil);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener el egresado', error: error.message });
  }
};

/**
 * @async
 * Controlador para crear un nuevo egresado y usuario.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con el egresado y usuario creados o un error.
 */
exports.createEgresado = async (req, res) => {
  const { usuario, egresado } = req.body;

  try {
    const existingUser = await Usuario.findOne({ where: { correo: usuario.correo } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está en uso.' });
    }

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

    const nuevoEgresado = await Egresado.create({
      id: nuevoUsuario.id,
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