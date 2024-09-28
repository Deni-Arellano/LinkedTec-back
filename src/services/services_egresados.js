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
    // Verificar si el correo ya está en uso
    const usuarioExistente = await Usuario.findOne({ where: { correo: usuarioData.correo } });
    if (usuarioExistente) {
      throw new Error('El correo ya está en uso');
    }

    // Crear nuevo usuario
    const nuevoUsuario = await Usuario.create(usuarioData, { transaction });

    // Crear nuevo egresado asociado al usuario
    const nuevoEgresado = await Egresado.create({
      id_usuario: nuevoUsuario.id_usuario,
      carrera: egresadoData.carrera,
      año_graduacion: egresadoData.año_graduacion,
      puesto: egresadoData.puesto
    }, { transaction });

    // Confirmar transacción
    await transaction.commit();

    return {
      success: true,
      message: 'Egresado y usuario creados exitosamente',
      usuario: nuevoUsuario,
      egresado: nuevoEgresado
    };
  } catch (error) {
    // En caso de error, revertir transacción
    await transaction.rollback();
    return { success: false, error: 'Error al crear egresado y usuario: ' + error.message };
  }
};