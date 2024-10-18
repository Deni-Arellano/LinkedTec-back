// src/controllers/egresados_controller.js
const { actualizarEgresadoYUsuario } = require('../services/services_egresados');
const Egresado = require('../models/egresados');
const Usuario = require('../models/usuarios');
const db = require('../config/database');
const { validateEgresado,validateId } = require('../middlewares/validations/validaciones_egresados');
const { validarRegistroUsuario,validarCorreoExistente,validarUsuariosExistentes,validarUsuarioExistente } = require('../middlewares/validations/validaciones_usuarios');




/**
 * @async
 * Controlador para obtener todos los egresados con paginación.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con los egresados paginados o un error.
 */
exports.getAllEgresadosWithUserInfo = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const offset = (pagina - 1) * limite;

    const [[{ total }]] = await db.query(`
      SELECT COUNT(*) AS total 
      FROM usuarios u
      JOIN egresados eg ON u.id = eg.id
    `);

    const [egresados] = await db.query(`
      SELECT u.id, u.nombre, u.apellido_paterno, u.apellido_materno, u.correo, u.contraseña, 
             u.fecha_nacimiento, u.telefono, u.sexo, u.biografia, u.role, u.imagen_usuario, 
             eg.carrera, eg.año_graduacion, eg.puesto 
      FROM usuarios u
      JOIN egresados eg ON u.id = eg.id
      LIMIT ${limite} OFFSET ${offset}
    `);

    await validarUsuariosExistentes(egresados);

    const totalPaginas = Math.ceil(total / limite);

    return res.json({
      total,
      pagina: pagina,
      limite: limite,
      total_paginas: totalPaginas,
      pagina_siguiente: {
        url: pagina < totalPaginas ? `http://localhost:3000/egresados?pagina=${pagina + 1}&limite=${limite}` : null,
        exists: pagina < totalPaginas
      },
      pagina_anterior: {
        url: pagina > 1 ? `http://localhost:3000/egresados?pagina=${pagina - 1}&limite=${limite}` : null,
        exists: pagina > 1
      },
      egresados
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los egresados', error: error.message });
  }
};





/**
 * @async
 * Controlador para obtener la información del rol de todos los egresados con paginación.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con la información del rol de los egresados o un error.
 */
exports.getEgresadosInfo = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const offset = (pagina - 1) * limite;

    const [[{ total }]] = await db.query(`
      SELECT COUNT(*) AS total 
      FROM egresados
    `);

    const [egresados] = await db.query(`
      SELECT id, carrera, año_graduacion, puesto 
      FROM egresados
      LIMIT ${limite} OFFSET ${offset}
    `);

    await validarUsuariosExistentes(egresados);

    const totalPaginas = Math.ceil(total / limite);

    return res.json({
      total,
      pagina: pagina,
      limite: limite,
      total_paginas: totalPaginas,
      pagina_siguiente: {
        url: pagina < totalPaginas ? `http://localhost:3000/egresados/info?pagina=${pagina + 1}&limite=${limite}` : null,
        exists: pagina < totalPaginas
      },
      pagina_anterior: {
        url: pagina > 1 ? `http://localhost:3000/egresados/info?pagina=${pagina - 1}&limite=${limite}` : null,
        exists: pagina > 1
      },
      egresados
    });
    
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

  const idError = validateId(id);
  if (idError) {
    return res.status(400).json({ message: idError.message });
  }

  try {
    const egresado = await Egresado.findByPk(id);
    if (!egresado) {
      return res.status(404).json({ message: 'Egresado no encontrado.' });
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
 * Controlador para crear un nuevo egresado y usuario.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con el egresado y usuario creados o un error.
 */
exports.createEgresado = async (req, res) => {
  const { usuario, egresado } = req.body;

  const { error: usuarioError } = await validarRegistroUsuario(usuario);
  if (usuarioError) {
    return res.status(400).json({ message: usuarioError.details.map(err => err.message) });
  }

  const egresadoError = validateEgresado(egresado);
  if (egresadoError) {
    return res.status(400).json({ message: egresadoError.message });
  }

  try {
    await validarCorreoExistente(usuario.correo);

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
    res.status(500).json({ message: 'El email ya existe o está en uso', error: error.message });
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

    await validarUsuarioExistente(usuario.id);

    const respuesta = {
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
    };

    return res.status(200).json(respuesta);

  } catch (error) {
    if (error.message === 'UserNotFoundError') {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.status(500).json({ message: 'Error al obtener la información del egresado', error: error.message });
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

    const egresado = await Egresado.findByPk(id);
    if (!egresado) {
      return res.status(404).json({ message: 'Egresado no encontrado' });
    }

    await validarUsuarioExistente(id);

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

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

    if (error.message === 'UserNotFoundError') {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    return res.status(500).json({ message: 'Error al obtener el perfil del egresado', error: error.message });
  }
};




/**
 * @async
 * Controlador para actualizar la información de un egresado y su usuario.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con el resultado de la operación o un error.
 */
exports.updateEgresado = async (req, res) => {
  const { id } = req.params;
  const { usuario, egresado } = req.body;

  try {
    const resultado = await actualizarEgresadoYUsuario(id, usuario, egresado);
    if (!resultado.success) {
      return res.status(404).json({ message: resultado.error });
    }

    return res.status(200).json({
      message: 'Egresado y usuario actualizados exitosamente',
      data: resultado.data
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar el egresado y usuario', error: error.message });
  }
};