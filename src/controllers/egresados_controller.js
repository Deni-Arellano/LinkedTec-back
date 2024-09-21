// src/controllers/egresados_controller.js
const egresadosService = require('../services/services_egresados');
const Egresado = require('../models/egresados');
const Usuario = require('../models/usuarios');
const db = require('../config/database');

// Obtener todos los egresados
exports.getAllEgresados = async (req, res) => {
  try {
    const [egresados] = await db.query(`
      SELECT eg.id, eg.carrera, eg.año_graduacion, eg.puesto, 
             u.nombre, u.apellido_paterno, u.apellido_materno, u.correo
      FROM egresados eg
      JOIN usuarios u ON eg.id = u.id
    `);
    return res.json(egresados); // Devuelve todos los egresados
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los egresados', error: error.message });
  }
};

// Obtener un egresado por ID
exports.getEgresadoPorId = async (req, res) => {
  const { id } = req.params;
  console.log('ID recibido:', id);  // Para verificar el ID recibido

  try {
    // Ejecutamos la consulta
    const egresado = await db.query(`
      SELECT eg.id, eg.carrera, eg.año_graduacion, eg.puesto 
      FROM egresados eg 
      WHERE eg.id = ?
    `, {
      replacements: [id],
      type: db.QueryTypes.SELECT // Indica que es una consulta SELECT
    });

    // Verificamos si el resultado contiene datos
    if (!egresado || egresado.length === 0) {
      return res.status(404).json({ message: 'Egresado no encontrado' });
    }

    // Devolvemos los datos del egresado encontrado
    return res.json(egresado[0]); // Accedemos al primer registro
  } catch (error) {
    // Capturamos cualquier error que ocurra en el proceso
    return res.status(500).json({ message: 'Error al obtener el egresado', error: error.message });
  }
};

// Crear un nuevo egresado y usuario desde un JSON anidado
exports.createEgresado = async (req, res) => {
  const { usuario, egresado } = req.body;

  try {
    // Verificar si el correo ya existe
    const existingUser = await Usuario.findOne({ where: { correo: usuario.correo } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está en uso.' });
    }

    // Crear un nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre: usuario.nombre,
      apellido_paterno: usuario.apellido_paterno,
      apellido_materno: usuario.apellido_materno,
      correo: usuario.correo,
      contraseña: usuario.contraseña,
      fecha_nacimiento: usuario.fecha_nacimiento,
      telefono: usuario.telefono,
      sexo: usuario.sexo,
      biografia: usuario.biografia,
      role: usuario.role,
      imagen_usuario: usuario.imagen_usuario
    });

    // Crear un nuevo egresado asociado al nuevo usuario
    const nuevoEgresado = await Egresado.create({
      id: nuevoUsuario.id, // Usa el ID del usuario recién creado
      carrera: egresado.carrera,
      año_graduacion: egresado.año_graduacion,
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
