// src/controllers/egresados_controller.js
const Egresados = require('../models/egresados');

// Crear un nuevo egresado
exports.createEgresado = async (req, res) => {
  try {
    const { id_usuario, telefono, sexo, fecha_nacimiento, biografia, carrera, ano_graduacion, puesto } = req.body;

    // Crear el nuevo egresado
    const nuevoEgresado = await Egresados.create({
      id_usuario,
      telefono,
      sexo,
      fecha_nacimiento,
      biografia,
      carrera,
      ano_graduacion,
      puesto
    });

    res.status(201).json(nuevoEgresado);
  } catch (error) {
    console.error('Error al crear el egresado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todos los egresados
exports.getEgresados = async (req, res) => {
  try {
    const egresados = await Egresados.findAll();
    res.status(200).json(egresados);
  } catch (error) {
    console.error('Error al obtener los egresados:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
