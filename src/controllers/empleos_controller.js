const Empleo = require('../models/empleos');


exports.getAllEmpleos = async (req, res) => {
  try {
    const empleos = await Empleo.findAll();
    res.json(empleos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener empleos', error: error.message });
  }
};


exports.createEmpleo = async (req, res) => {
  try {
    const empleo = await Empleo.create(req.body);
    res.status(201).json(empleo);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear empleo', error: error.message });
  }
};


exports.getEmpleoPorId = async (req, res) => {
  try {
    const empleo = await Empleo.findByPk(req.params.id_empleo);
    if (!empleo) {
      return res.status(404).json({ message: 'Empleo no encontrado' });
    }
    res.json(empleo);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener empleo', error: error.message });
  }
};


exports.deleteEmpleo = async (req, res) => {
  try {
    const empleo = await Empleo.findByPk(req.params.id_empleo);
    if (!empleo) {
      return res.status(404).json({ message: 'Empleo no encontrado' });
    }

    await empleo.destroy();
    res.json({ message: 'Empleo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar empleo', error: error.message });
  }
};
