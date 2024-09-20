// src/controllers/egresados_controller.js
const Egresado = require('../models/egresados');
const Usuario = require('../models/usuarios');

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

// Crear un nuevo usuario y egresado desde un JSON anidado
exports.createEgresado = async (req, res) => {
  const { usuario, egresado } = req.body; // Extraemos los datos anidados del cuerpo de la solicitud

  try {
    // Crea un nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre: usuario.nombre,
      apellido_paterno: usuario.apellido_paterno,
      apellido_materno: usuario.apellido_materno,
      correo: usuario.correo,
      contrasena: usuario.contrasena,
      tipo_usuario: usuario.tipo_usuario
    });

    // Crea un nuevo egresado asociado al nuevo usuario
    const nuevoEgresado = await Egresado.create({
      id_usuario: nuevoUsuario.id_usuario, // Usa el ID del usuario recién creado
      telefono: egresado.telefono,
      sexo: egresado.sexo,
      fecha_nacimiento: egresado.fecha_nacimiento,
      biografia: egresado.biografia,
      carrera: egresado.carrera,
      ano_graduacion: egresado.ano_graduacion,
      puesto: egresado.puesto
    });

    res.status(201).json({
      message: 'Egresado y usuario creados exitosamente',
      usuario: nuevoUsuario,
      egresado: nuevoEgresado
    });
  } catch (error) {
    console.error('Error al crear egresado y usuario:', error);
    res.status(500).json({ message: 'Error al crear egresado y usuario', error: error.message });
  }
};
