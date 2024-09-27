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
 * Controlador para obtener la información del rol de todos los egresados.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con la información del rol de los egresados o un error.
 */
exports.getEgresadosInfo = async (req, res) => {
  try {
    const [egresados] = await db.query(`
      SELECT id, carrera, año_graduacion, puesto 
      FROM egresados
    `);
    return res.json(egresados);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener la información de los egresados', error: error.message });
  }
};

/**
 * @async
 * Controlador para obtener la información tanto de usuario como del rol de todos los egresados.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con la información completa de los egresados o un error.
 */
exports.getAllEgresadosWithUserInfo = async (req, res) => {
  try {
    const [egresados] = await db.query(`
      SELECT u.id, u.nombre, u.apellido_paterno, u.apellido_materno, u.correo, u.contraseña, u.fecha_nacimiento, u.telefono, u.sexo, u.biografia, u.role, u.imagen_usuario, eg.carrera, eg.año_graduacion, eg.puesto 
      FROM usuarios u
      JOIN egresados eg ON u.id = eg.id
    `);
    return res.json(egresados);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener la información de los egresados', error: error.message });
  }
};

/**
 * @async
 * Controlador para obtener solo la información del rol de un egresado por ID.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con la información del rol del egresado o un error.
 */
exports.getEgresadoRoleInfoById = async (req, res) => {
  const { id } = req.params;

  try {
    const egresado = await Egresado.findByPk(id);
    if (!egresado) {
      return res.status(404).json({ message: 'Egresado no encontrado' });
    }

    return res.json({
      carrera: egresado.carrera,
      año_graduacion: egresado.año_graduacion,
      puesto: egresado.puesto,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener la información del egresado', error: error.message });
  }
};

/**
 * @async
 * Controlador para obtener tanto la información de usuario como del rol de un egresado por ID.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con la información completa del egresado o un error.
 */
exports.getEgresadoWithUserInfoById = async (req, res) => {
  const { id } = req.params;

  try {
    const egresado = await Egresado.findByPk(id);
    if (!egresado) {
      return res.status(404).json({ message: 'Egresado no encontrado' });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json({
      id: usuario.id,
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
      imagen_usuario: usuario.imagen_usuario,
      carrera: egresado.carrera,
      año_graduacion: egresado.año_graduacion,
      puesto: egresado.puesto,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener la información del egresado', error: error.message });
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

/**
 * @async
 * Controlador para obtener todos los datos del perfil de un egresado por ID.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con el perfil del egresado o un error.
 */
exports.getEgresadoProfileById = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar el egresado por ID
    const egresado = await Egresado.findByPk(id);
    if (!egresado) {
      return res.status(404).json({ message: 'Egresado no encontrado' });
    }

    // Buscar el usuario asociado al egresado
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Responder con la información requerida
    return res.json({
      nombre: usuario.nombre,
      apellido_paterno: usuario.apellido_paterno,
      apellido_materno: usuario.apellido_materno,
      role: usuario.role,
      carrera: egresado.carrera,
      biografia: usuario.biografia,
      telefono: usuario.telefono,
      correo: usuario.correo,
      fecha_nacimiento: usuario.fecha_nacimiento,
      sexo: usuario.sexo
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener el perfil del egresado', error: error.message });
  }
};
