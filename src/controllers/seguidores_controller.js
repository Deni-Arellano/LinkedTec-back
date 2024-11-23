const Seguimiento = require('../models/seguidores');
const Usuario = require('../models/usuarios');

const gestionarSeguimiento = async (req, res) => {
  const { id_usuario, id_perfil_a_seguir } = req.body;

  try {
    const usuario = await Usuario.findByPk(id_usuario);
    const perfil = await Usuario.findByPk(id_perfil_a_seguir);

    if (!usuario) {
      return res.status(404).json({
        message: `El usuario con ID ${id_usuario} no existe.`,
      });
    }

    if (!perfil) {
      return res.status(404).json({
        message: `El perfil a seguir con ID ${id_perfil_a_seguir} no existe.`,
      });
    }

    const seguimientoExistente = await Seguimiento.findOne({
      where: { id_usuario, id_perfil_a_seguir },
    });

    if (seguimientoExistente) {
      await seguimientoExistente.destroy();
      return res.status(200).json({
        message: "Has dejado de seguir al usuario.",
      });
    }

    const nuevoSeguimiento = await Seguimiento.create({
      id_usuario,
      id_perfil_a_seguir,
    });

    return res.status(201).json({
      message: "Has comenzado a seguir a este perfil.",
      seguimiento: {
        id_usuario: nuevoSeguimiento.id_usuario,
        id_perfil_a_seguir: nuevoSeguimiento.id_perfil_a_seguir,
        fecha_seguimiento: nuevoSeguimiento.fecha_seguimiento,
      },
    });
  } catch (error) {
    console.error("Error al gestionar el seguimiento:", error);
    return res.status(500).json({
      error: "Error interno del servidor.",
      detalles: error.message,
    });
  }
};

module.exports = { gestionarSeguimiento };
