const Docente = require('../models/docentes');
const Usuario = require('../models/usuarios');

// Función para crear un nuevo docente
const createDocente = async (req, res) => {
  try {
    const { usuario, docente } = req.body;

    // Verifica si los datos de 'usuario' y 'docente' existen
    if (!usuario || !docente) {
      return res.status(400).json({ error: "El cuerpo de la solicitud está incompleto." });
    }

    const { 
      nombre, 
      apellido_paterno, 
      apellido_materno, 
      correo, 
      contraseña, 
      fecha_nacimiento, 
      telefono, 
      sexo, 
      biografia, 
      role 
    } = usuario;

    const { 
      ultimo_nivel_estudios, 
      numero_empleado, 
      academia 
    } = docente;

    // Crear el nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido_paterno,
      apellido_materno,
      correo,
      contraseña,
      fecha_nacimiento,
      telefono,
      sexo,
      biografia,
      role
    });

    // Crear el nuevo docente
    const nuevoDocente = await Docente.create({
      id: nuevoUsuario.id, // Usar el mismo ID del usuario
      ultimo_nivel_estudios,
      numero_empleado,
      academia
    });

    res.status(201).json(nuevoDocente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función para obtener todos los docentes
const getAllDocentes = async (req, res) => {
  try {
    const docentes = await Docente.findAll({
      include: [Usuario] // Incluye los datos del usuario asociado
    });
    res.status(200).json(docentes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Función para obtener un docente por ID
const getDocenteById = async (req, res) => {
  try {
    const id = req.params.id;
    const docente = await Docente.findOne({
      where: { id: id }, // Usar el ID del docente
      include: [Usuario] // Incluye los datos del usuario asociado
    });

    if (!docente) {
      return res.status(404).json({ error: "Docente no encontrado." });
    }

    res.status(200).json(docente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDocente,
  getAllDocentes,
  getDocenteById
};
