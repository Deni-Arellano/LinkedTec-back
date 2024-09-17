// src/controllers/egresados_controller.js
const Egresado = require('../models/egresados');
const Usuario = require('../models/usuarios'); // Importa el modelo Usuario si es necesario

// Obtener todos los egresados
exports.getAllEgresados = async (req, res) => {
  try {
    const egresados = await Egresado.findAll();
    res.json(egresados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener egresados', error: error.message });
  }
};

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

// Crear un nuevo usuario y egresado
exports.createEgresado = async (req, res) => {
  const { nombre, apellido_paterno, apellido_materno, correo, contrasena, tipo_usuario, telefono, sexo, fecha_nacimiento, biografia, carrera, ano_graduacion, puesto } = req.body;

  try {
    // Crea un nuevo usuario
    const usuario = await Usuario.create({
      nombre,
      apellido_paterno,
      apellido_materno,
      correo,
      contrasena,
      tipo_usuario
    });

    // Crea un nuevo egresado asociado al nuevo usuario
    const egresado = await Egresado.create({
      id_usuario: usuario.id_usuario, // Usa el ID del usuario recién creado
      telefono,
      sexo,
      fecha_nacimiento,
      biografia,
      carrera,
      ano_graduacion,
      puesto
    });

    res.status(201).json(egresado);
  } catch (error) {
    console.error('Error al crear egresado y usuario:', error);
    res.status(500).json({ message: 'Error al crear egresado y usuario', error: error.message });
  }
};
