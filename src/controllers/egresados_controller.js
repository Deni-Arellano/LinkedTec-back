// src/controllers/egresados_controller.js
const Egresado = require('../models/egresados');

// Obtener un egresado por ID
exports.getEgresadoPorId = async (req, res) => {
  try {
    const egresado = await Egresado.findByPk(req.params.id_usuario);

    if (!egresado) {
      return res.status(404).json({ success: false, error: 'Egresado no encontrado' });
    }

    res.json(egresado);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener egresado', error: error.message });
  }
};

// Obtener todos los egresados
exports.getAllEgresados = async (req, res) => {
  try {
    const egresados = await Egresado.findAll();
    res.json(egresados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener egresados' });
  }
};

// Crear un nuevo egresado
exports.createEgresado = async (req, res) => {
  try {
    const egresado = await Egresado.create(req.body);
    res.status(201).json(egresado);
  } catch (error) {
    console.error('Error al crear egresado:', error); 
    res.status(500).json({ message: 'Error al crear egresado', error: error.message });
  }
};
