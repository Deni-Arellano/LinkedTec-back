const Egresado = require('../models/egresados');
const Usuario = require('../models/usuarios');
const db = require('../config/database');

/**
 * @async
 * Servicio para obtener todos los egresados con la información de usuario asociada.
 * @returns {Object} Un objeto que contiene el resultado de la operación.
 */
exports.obtenerTodosLosEgresados = async () => {
  try {
    const [egresados] = await db.query(`
      SELECT eg.id_usuario AS id, eg.carrera, eg.año_graduacion, eg.puesto, 
             u.nombre, u.apellido_paterno, u.apellido_materno, u.correo
      FROM egresados eg
      JOIN usuarios u ON eg.id_usuario = u.id_usuario
    `);
    return { success: true, data: egresados };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * @async
 * Servicio para obtener un egresado por su ID con la información de usuario.
 * @param {number} id - ID del egresado a buscar.
 * @returns {Object} Un objeto con el resultado de la operación.
 */
exports.obtenerEgresadoPorId = async (id) => {
  try {
    const [egresado] = await db.query(`
      SELECT eg.id_usuario AS id, eg.carrera, eg.año_graduacion, eg.puesto,
             u.nombre, u.apellido_paterno, u.apellido_materno, u.correo,
             u.biografia, u.telefono, u.fecha_nacimiento, u.sexo
      FROM egresados eg
      JOIN usuarios u ON eg.id_usuario = u.id_usuario
      WHERE eg.id_usuario = ?
    `, {
      replacements: [id],
      type: db.QueryTypes.SELECT 
    });

    if (!egresado) {
      throw new Error('Egresado no encontrado');
    }
    return { success: true, data: egresado };
  } catch (error) {
    return { success: false, error: 'Error al obtener el egresado: ' + error.message };
  }
};

/**
 * @async
 * Servicio para crear un nuevo egresado y usuario asociado.
 * @param {Object} usuarioData - Datos del usuario.
 * @param {Object} egresadoData - Datos del egresado.
 * @returns {Object} Un objeto con el resultado de la operación.
 */
exports.crearEgresado = async (usuarioData, egresadoData) => {
  const transaction = await db.transaction();

  try {
    const usuarioExistente = await Usuario.findOne({ where: { correo: usuarioData.correo } });
    if (usuarioExistente) {
      throw new Error('El correo ya está en uso');
    }

    const nuevoUsuario = await Usuario.create(usuarioData, { transaction });

    const nuevoEgresado = await Egresado.create({
      id_usuario: nuevoUsuario.id_usuario,
      carrera: egresadoData.carrera,
      año_graduacion: egresadoData.año_graduacion,
      puesto: egresadoData.puesto
    }, { transaction });

    await transaction.commit();

    return {
      success: true,
      message: 'Egresado y usuario creados exitosamente',
      usuario: nuevoUsuario,
      egresado: nuevoEgresado
    };
  } catch (error) {
    await transaction.rollback();
    return { success: false, error: 'Error al crear egresado y usuario: ' + error.message };
  }
};








/**
 * @async
 * Servicio para actualizar la información de un egresado y su usuario.
 * @param {number} id - ID del egresado a actualizar.
 * @param {Object} usuarioData - Datos del usuario a actualizar.
 * @param {Object} egresadoData - Datos del egresado a actualizar.
 * @returns {Object} Un objeto con el resultado de la operación.
 */
exports.actualizarEgresadoYUsuario = async (id, usuarioData, egresadoData) => {
  const transaction = await db.transaction();

  try {
    const egresado = await Egresado.findByPk(id);
    if (!egresado) {
      return { success: false, error: 'Egresado no encontrado' };
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    await usuario.update(usuarioData, { transaction });
    await egresado.update(egresadoData, { transaction });

    await transaction.commit();

    return { success: true, data: { usuario, egresado } };
  } catch (error) {
    await transaction.rollback();
    return { success: false, error: 'Error al actualizar el egresado y usuario: ' + error.message };
  }
};