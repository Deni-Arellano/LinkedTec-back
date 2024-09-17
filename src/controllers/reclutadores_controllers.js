const Usuario = require('../models/usuarios');
const Reclutador = require('../models/reclutadores');

const crearReclutador = async (req, res) => {
  const { usuario, reclutador } = req.body;

  try {
    // Crear el usuario
    const nuevoUsuario = await Usuario.create({
      nombre: usuario.nombre,
      apellido_paterno: usuario.apellido_paterno,
      apellido_materno: usuario.apellido_materno,
      correo: usuario.correo,
      contrasena: usuario.contrasena,
      tipo_usuario: usuario.tipo_usuario
    });

    // Crear el reclutador
    const nuevoReclutador = await Reclutador.create({
      id_usuario: nuevoUsuario.id_usuario,
      telefono: reclutador.telefono,
      sexo: reclutador.sexo,
      nombre_empresa: reclutador.nombre_empresa,
      fecha_fundacion: reclutador.fecha_fundacion,
      sector_comercial: reclutador.sector_comercial
    });

    res.status(201).json({ nuevoUsuario, nuevoReclutador });
  } catch (error) {
    console.error('Error al crear reclutador:', error);
    res.status(500).json({ message: 'Error al crear reclutador', error });
  }
};


const obtenerReclutador = async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar el reclutador por su ID
    const reclutador = await Reclutador.findByPk(id);
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