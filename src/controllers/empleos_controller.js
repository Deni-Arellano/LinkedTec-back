const EmpleoService = require('../services/services_empleos.js');

// Obtener todos los empleos
exports.getAllEmpleos = async (req, res) => {
  const resultado = await EmpleoService.obtenerTodosLosEmpleos();
  if (resultado.success) {
    return res.json(resultado.data);
  }
  return res.status(500).json({ message: 'Error al obtener empleos', error: resultado.error });
};

// Crear un nuevo empleo
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

// Obtener un empleo por ID
exports.getEmpleoPorId = async (req, res) => {
  const resultado = await EmpleoService.obtenerEmpleoPorId(req.params.id_empleo);
  if (resultado.success) {
    return res.json(resultado.data);
  }
  return res.status(404).json({ message: resultado.error });
};

// Editar un empleo
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

// Eliminar un empleo por ID
exports.deleteEmpleo = async (req, res) => {
  const resultado = await EmpleoService.eliminarEmpleo(req.params.id_empleo);
  if (resultado.success) {
    return res.json({ message: resultado.message });
  }
  return res.status(404).json({ message: resultado.error });
};
