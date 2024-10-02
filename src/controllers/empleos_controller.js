const EmpleoService = require('../services/services_empleos.js');
const UsuarioService = require('../services/services_usuarios.js'); 
const { validarEmpleo,validarEmpleoExistente,UpdateConflictError,validarEmpleoNoEncontrado } = require('../middlewares/validations/validaciones_empleos');

/**
 * @async
 * Obtiene todos los empleos de la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con todos los empleos o un error.
 */
exports.getAllEmpleos = async (req, res) => {
  try {
    const resultado = await EmpleoService.obtenerTodosLosEmpleos();

    validarEmpleoNoEncontrado(resultado.data);

    return res.json(resultado.data);
  } catch (error) {
    if (error instanceof EmpleoNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Error al obtener empleos', error: error.message });
  }
};



/**
 * @async
 * Crea un nuevo empleo en la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con el empleo creado o un error.
 */
exports.createEmpleo = async (req, res) => {
  const { id_usuario, titulo, empresa, salario, descripcion, ubicacion, nivel_de_ingles } = req.body;


  const error = validarEmpleo(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const usuario = await UsuarioService.obtenerUsuarioPorId(id_usuario);
  if (!usuario || usuario.role !== 'Reclutadores') {
    return res.status(403).json({ message: 'Solo los usuarios con rol Reclutadores pueden crear empleos' });
  }
  const empleosUsuario = await EmpleoService.obtenerTodosLosEmpleos();
  const empleosDelUsuario = empleosUsuario.data.filter(empleo => empleo.id_usuario === id_usuario);
  if (empleosDelUsuario.length >= 5) {
    return res.status(400).json({ message: 'No puedes tener más de 5 empleos activos.' });
  }
  const empleoExistente = empleosDelUsuario.find(e => e.titulo === titulo && e.empresa === empresa);
  if (empleoExistente) {
    return res.status(409).json({ message: 'Ya existe un empleo con ese título y empresa.' });
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


/**
 * @async
 * Obtiene un empleo específico por su ID.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con el empleo encontrado o un error.
 */
exports.getEmpleoPorId = async (req, res) => {
  const empleo = await EmpleoService.obtenerEmpleoPorId(req.params.id_empleo);

  validarEmpleoNoEncontrado(empleo);

  return res.json(empleo);
};


/**
 * @async
 * Edita un empleo existente en la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con el mensaje de éxito y los datos actualizados o un error.
 */
exports.updateEmpleo = async (req, res) => {
  const { id_usuario } = req.body;

  const usuario = await UsuarioService.obtenerUsuarioPorId(id_usuario);
  if (!usuario || usuario.role !== 'Reclutadores') {
    return res.status(403).json({ message: 'Solo los usuarios con rol Reclutadores pueden editar empleos' });
  }
  const empleo = await EmpleoService.obtenerEmpleoPorId(req.params.id_empleo);
  if (!empleo.success) {
    return res.status(404).json({ message: 'Empleo no encontrado' });
  }
  if (empleo.data.id_usuario !== id_usuario) {
    return res.status(403).json({ message: 'No tienes permiso para editar este empleo' });
  }
  const error = validarEmpleo(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const resultado = await EmpleoService.editarEmpleo(req.params.id_empleo, req.body);
  if (resultado.success) {
    return res.json({ message: resultado.message, data: resultado.data });
  }
  
  return res.status(400).json({ message: resultado.error });
};




/**
 * @async
 * Elimina un empleo específico por su ID.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con un mensaje de éxito o un error.
 */
exports.deleteEmpleo = async (req, res) => {
  const empleo = await EmpleoService.obtenerEmpleoPorId(req.params.id_empleo);
  validarEmpleoNoEncontrado(empleo);

  const resultado = await EmpleoService.eliminarEmpleo(req.params.id_empleo);
  if (resultado.success) {
    return res.json({ message: resultado.message });
  }
  return res.status(500).json({ message: 'Error al eliminar el empleo', error: resultado.error });
};
