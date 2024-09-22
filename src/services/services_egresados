const Egresado = require('../models/egresados');
const Usuario = require('../models/usuarios');

/**
 * @async
 * Obtener todos los egresados
 */
exports.obtenerTodosLosEgresados = async () => {
  try {
    const egresados = await Egresado.findAll({
      include: [Usuario]
    });
    return { success: true, data: egresados };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * @async
 * Obtener un egresado por ID
 */
exports.getEgresadoPorId = async (req, res) => {
  const { id } = req.params;
  console.log('ID recibido:', id);

  try {
    const [egresado] = await db.query(`
      SELECT eg.id, eg.carrera, eg.año_graduacion, eg.puesto
      FROM egresados eg
      WHERE eg.id = ?
    `, {
      replacements: [id],
      type: db.QueryTypes.SELECT 
    });

    if (egresado.length === 0) {
      return res.status(404).json({ message: 'Egresado no encontrado' });
    }
    return res.json(egresado[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener el egresado', error: error.message });
  }
};

/**
 * @async
 * Crear un nuevo egresado y usuario
 */
exports.crearEgresado = async (usuarioData, egresadoData) => {
  try {
    const usuarioExistente = await Usuario.findOne({ where: { correo: usuarioData.correo } });
    if (usuarioExistente) {
      throw new Error('El correo ya está en uso');
    }

    const nuevoUsuario = await Usuario.create(usuarioData);
    const nuevoEgresado = await Egresado.create({
      id_usuario: nuevoUsuario.id_usuario,
      carrera: egresadoData.carrera,
      año_graduacion: egresadoData.año_graduacion,
      puesto: egresadoData.puesto
    });

    return {
      success: true,
      message: 'Egresado y usuario creados exitosamente',
      usuario: nuevoUsuario,
      egresado: nuevoEgresado
    };
  } catch (error) {
    return { success: false, error: 'Error al crear egresado y usuario: ' + error.message };
  }
};
