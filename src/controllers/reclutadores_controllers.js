const { crearReclutadorServicio, obtenerReclutadorServicio, obtenerTodosReclutadoresServicio, obtenerTodosUsuariosYReclutadores,obtenerReclutadorDetalladoPorIdServicio } = require('../services/services_reclutadores');

/**
 * Controlador para crear un reclutador.
 * @async
 * @function crearReclutador
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con el reclutador creado o un error.
 */
const crearReclutador = async (req, res) => {
  const { usuario, reclutador } = req.body;

  try {
    const result = await crearReclutadorServicio(usuario, reclutador);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error al crear reclutador:', error);
    res.status(500).json({ message: 'Error al crear reclutador', error: error.message });
  }
};

/**
 * Controlador para obtener un reclutador por su ID.
 * @async
 * @function obtenerReclutador
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con los datos del reclutador o un error.
 */
const obtenerReclutador = async (req, res) => {
  const { id } = req.params;

  try {
    const reclutador = await obtenerReclutadorServicio(id);

    if (reclutador) {
      res.status(200).json({
        nombre: reclutador.Usuario.nombre,
        apellido_paterno: reclutador.Usuario.apellido_paterno,
        apellido_materno: reclutador.Usuario.apellido_materno,
        role: reclutador.Usuario.role,
        correo: reclutador.Usuario.correo,
        telefono: reclutador.Usuario.telefono,
        fecha_nacimiento: reclutador.Usuario.fecha_nacimiento,
        sexo: reclutador.Usuario.sexo,
        nombre_empresa: reclutador.nombre_empresa,
        giro: reclutador.giro
      });
    } else {
      res.status(404).json({ message: 'Reclutador no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener reclutador:', error);
    res.status(500).json({ message: 'Error al obtener reclutador', error: error.message });
  }
};

/**
 * Controlador para obtener todos los reclutadores.
 * @async
 * @function obtenerTodosReclutadores
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con la lista de reclutadores o un error.
 */
const obtenerTodosReclutadores = async (req, res) => {
  try {
    const reclutadores = await obtenerTodosReclutadoresServicio();
    res.status(200).json(reclutadores);
  } catch (error) {
    console.error('Error al obtener todos los reclutadores:', error);
    res.status(500).json({ message: 'Error al obtener reclutadores', error: error.message });
  }
};

const obtenerUsuariosYReclutadores = async (req, res) => {
  try {
    const reclutadores = await obtenerTodosUsuariosYReclutadores();

    // Procesamos la respuesta para obtener un formato adecuado
    const response = reclutadores.map(reclutador => ({
      id: reclutador.Usuario.id,
      nombre: reclutador.Usuario.nombre,
      apellido_paterno: reclutador.Usuario.apellido_paterno,
      apellido_materno: reclutador.Usuario.apellido_materno,
      correo: reclutador.Usuario.correo,
      contraseña: reclutador.Usuario.contraseña,
      fecha_nacimiento: reclutador.Usuario.fecha_nacimiento,
      telefono: reclutador.Usuario.telefono,
      sexo: reclutador.Usuario.sexo,
      biografia: reclutador.Usuario.biografia,
      role: reclutador.Usuario.role,
      imagen_usuario: reclutador.Usuario.imagen_usuario,
      nombre_empresa: reclutador.nombre_empresa,
      sede: reclutador.sede,
      giro: reclutador.giro
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error('Error al obtener usuarios y reclutadores:', error);
    res.status(500).json({ message: 'Error al obtener usuarios y reclutadores', error: error.message });
  }
};
const obtenerReclutadorPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const reclutador = await obtenerReclutadorPorIdServicio(id);

    res.status(200).json({
      id: reclutador.id,
      nombre_empresa: reclutador.nombre_empresa,
      sede: reclutador.sede,
      giro: reclutador.giro
    });
  } catch (error) {
    console.error('Error al obtener reclutador:', error);
    res.status(500).json({ message: 'Error al obtener reclutador', error: error.message });
  }
};


const obtenerReclutadorDetalladoPorId = async (req, res) => {
  const { id } = req.params; // Asegúrate de que estás recibiendo el id correctamente
  try {
    const reclutador = await obtenerReclutadorDetalladoPorIdServicio(id);

    if (!reclutador) {
      return res.status(404).json({ message: 'Reclutador no encontrado' });
    }

    // Procesamos la respuesta para un formato adecuado
    const response = {
      id: reclutador.Usuario.id,
      nombre: reclutador.Usuario.nombre,
      apellido_paterno: reclutador.Usuario.apellido_paterno,
      apellido_materno: reclutador.Usuario.apellido_materno,
      correo: reclutador.Usuario.correo,
      contraseña: reclutador.Usuario.contraseña,
      fecha_nacimiento: reclutador.Usuario.fecha_nacimiento,
      telefono: reclutador.Usuario.telefono,
      sexo: reclutador.Usuario.sexo,
      biografia: reclutador.Usuario.biografia,
      role: reclutador.Usuario.role,
      imagen_usuario: reclutador.Usuario.imagen_usuario,
      nombre_empresa: reclutador.nombre_empresa,
      sede: reclutador.sede,
      giro: reclutador.giro
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error al obtener reclutador por ID:', error);
    res.status(500).json({ message: 'Error al obtener reclutador', error: error.message });
  }
};

module.exports = {
  crearReclutador,
  obtenerReclutador,
  obtenerTodosReclutadores,
  obtenerUsuariosYReclutadores,
  obtenerReclutadorPorId,
  obtenerReclutadorDetalladoPorId
};