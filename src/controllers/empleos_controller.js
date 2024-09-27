const EmpleoService = require('../services/services_empleos.js');
const UsuarioService = require('../services/services_usuarios.js'); 

// Controlador para obtener todos los empleos
/**
 * @async
 * Obtiene todos los empleos de la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con todos los empleos o un error.
 */
exports.getAllEmpleos = async (req, res) => {
  const resultado = await EmpleoService.obtenerTodosLosEmpleos();
  if (resultado.success) {
    return res.json(resultado.data);
  }
  return res.status(500).json({ message: 'Error al obtener empleos', error: resultado.error });
};

// Controlador para crear un nuevo empleo
/**
 * @async
 * Crea un nuevo empleo en la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con el empleo creado o un error.
 */
exports.createEmpleo = async (req, res) => {
  const { id_usuario, titulo, empresa, salario, descripcion, ubicacion, nivel_de_ingles } = req.body;

  // Verificar el rol del usuario
  const usuario = await UsuarioService.obtenerUsuarioPorId(id_usuario);
  if (!usuario || usuario.role !== 'Reclutadores') {
    return res.status(403).json({ message: 'Solo los usuarios con rol Reclutadores pueden crear empleos' });
  }

  const resultado = await EmpleoService.crearEmpleo({
    id_usuario,
    titulo,
    empresa,
    salario,
    descripcion,
    ubicacion,
    nivel_de_ingles,
  });

  if (resultado.success) {
    return res.status(201).json(resultado.data);
  }
  return res.status(400).json({ message: resultado.error });
};

// Controlador para obtener un empleo por su ID
/**
 * @async
 * Obtiene un empleo específico por su ID.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con el empleo encontrado o un error.
 */
exports.getEmpleoPorId = async (req, res) => {
  const resultado = await EmpleoService.obtenerEmpleoPorId(req.params.id_empleo);
  if (resultado.success) {
    return res.json(resultado.data);
  }
  return res.status(404).json({ message: resultado.error });
};

// Controlador para editar un empleo
/**
 * @async
 * Edita un empleo existente en la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con el mensaje de éxito y los datos actualizados o un error.
 */
exports.updateEmpleo = async (req, res) => {
  const { id_usuario } = req.body;

  // Verificar el rol del usuario
  const usuario = await UsuarioService.obtenerUsuarioPorId(id_usuario);
  if (!usuario || usuario.role !== 'Reclutadores') {
    return res.status(403).json({ message: 'Solo los usuarios con rol Reclutadores pueden editar empleos' });
  }

  const resultado = await EmpleoService.editarEmpleo(req.params.id_empleo, req.body);
  if (resultado.success) {
    return res.json({ message: resultado.message, data: resultado.data });
  }
  return res.status(400).json({ message: resultado.error });
};

// Controlador para eliminar un empleo por su ID
/**
 * @async
 * Elimina un empleo específico por su ID.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con un mensaje de éxito o un error.
 */
exports.deleteEmpleo = async (req, res) => {
  const resultado = await EmpleoService.eliminarEmpleo(req.params.id_empleo);
  if (resultado.success) {
    return res.json({ message: resultado.message });
  }
  return res.status(404).json({ message: resultado.error });
};