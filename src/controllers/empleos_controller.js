const EmpleoService = require('../services/services_empleos.js');

/**
 * @async
 * Controlador para obtener todos los empleos.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con los empleos o un error.
 */
exports.getAllEmpleos = async (req, res) => {
  const resultado = await EmpleoService.obtenerTodosLosEmpleos();
  if (resultado.success) {
    return res.json(resultado.data);
  }
  return res.status(500).json({ message: 'Error al obtener empleos', error: resultado.error });
};

/**
 * @async
 * Controlador para crear un nuevo empleo.
 * Solo los usuarios con rol "Empresa" pueden crear empleos.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con el empleo creado o un error.
 */
exports.createEmpleo = async (req, res) => {
  const role = req.body.role || 'Empresa';

  if (role !== 'Empresa') {
    return res.status(403).json({ message: 'Solo los usuarios con rol Empresa pueden crear empleos' });
  }

  const resultado = await EmpleoService.crearEmpleo(req.body);
  if (resultado.success) {
    return res.status(201).json(resultado.data);
  }
  return res.status(400).json({ message: resultado.error });
};

/**
 * @async
 * Controlador para obtener un empleo por su ID.
 * @param {Object} req - El objeto de solicitud (request) de Express, contiene el ID del empleo.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con los datos del empleo o un error.
 */
exports.getEmpleoPorId = async (req, res) => {
  const resultado = await EmpleoService.obtenerEmpleoPorId(req.params.id_empleo);
  if (resultado.success) {
    return res.json(resultado.data);
  }
  return res.status(404).json({ message: resultado.error });
};

/**
 * @async
 * Controlador para editar un empleo.
 * Solo los usuarios con rol "Empresa" pueden editar empleos.
 * @param {Object} req - El objeto de solicitud (request) de Express, contiene los datos del empleo a actualizar.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con los datos del empleo actualizado o un error.
 */
exports.updateEmpleo = async (req, res) => {
  const role = req.body.role || 'Empresa';

  if (role !== 'Empresa') {
    return res.status(403).json({ message: 'Solo los usuarios con rol Empresa pueden editar empleos' });
  }

  const resultado = await EmpleoService.editarEmpleo(req.params.id_empleo, req.body);
  if (resultado.success) {
    return res.json({ message: resultado.message, data: resultado.data });
  }
  return res.status(400).json({ message: resultado.error });
};

/**
 * @async
 * Controlador para eliminar un empleo por su ID.
 * @param {Object} req - El objeto de solicitud (request) de Express, contiene el ID del empleo.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON confirmando la eliminación del empleo o un error.
 */
exports.deleteEmpleo = async (req, res) => {
  const resultado = await EmpleoService.eliminarEmpleo(req.params.id_empleo);
  if (resultado.success) {
    return res.json({ message: resultado.message });
  }
  return res.status(404).json({ message: resultado.error });
};
