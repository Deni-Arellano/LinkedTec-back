const { Docente } = require('../models/docentes');
const { Usuario } = require('../models/usuarios');

const createDocente = async (req, res) => {
  try {
    const { usuario, docente } = req.body;

    // Verifica si los datos de 'usuario' y 'docente' existen
    if (!usuario || !docente) {
      return res.status(400).json({ error: "El cuerpo de la solicitud está incompleto." });
    }

    const { nombre, apellido_paterno, apellido_materno, correo, contrasena, tipo_usuario } = usuario;
    const { fecha_nacimiento, biografia, telefono, ultimo_nivel_estudios, numero_empleado, rh, academia } = docente;

    // Crear el nuevo usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido_paterno,
      apellido_materno,
      correo,
      contrasena,
      tipo_usuario
    });

    // Crear el nuevo docente
    const nuevoDocente = await Docente.create({
      id_usuario: nuevoUsuario.id_usuario,
      fecha_nacimiento,
      biografia,
      telefono,
      ultimo_nivel_estudios,
      numero_empleado,
      rh,
      academia
    });

    res.status(201).json(nuevoDocente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDocente
};
