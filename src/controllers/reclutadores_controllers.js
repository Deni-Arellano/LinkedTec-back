const { crearReclutadorServicio, obtenerReclutadorServicio } = require('../services/services_reclutadores');

// Controlador para crear un reclutador
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

// Controlador para obtener un reclutador
const obtenerReclutador = async (req, res) => {
  const { id } = req.params;

  try {
    const reclutador = await obtenerReclutadorServicio(id);
    if (reclutador) {
      res.status(200).json(reclutador);
    } else {
      res.status(404).json({ message: 'Reclutador no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener reclutador:', error);
    res.status(500).json({ message: 'Error al obtener reclutador', error: error.message });
  }
};

module.exports = {
  crearReclutador,
  obtenerReclutador,
};
