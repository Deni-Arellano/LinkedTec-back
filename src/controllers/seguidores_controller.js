const { seguir, dejarDeSeguir } = require('../services/services_seguidores');
const Usuario = require('../models/usuarios');
const Seguimiento = require('../models/seguidores');

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
      await dejarDeSeguir(seguimientoExistente);
      return res.status(200).json({
        message: "Has dejado de seguir al usuario.",
      });
    } else {
      const resultado = await seguir(id_usuario, id_perfil_a_seguir);
      return res.status(200).json({
        message: "Has comenzado a seguir al usuario.",
        seguimiento: resultado.seguimiento,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error al gestionar el seguimiento: ' + error.message,
    });
  }
};


module.exports = { gestionarSeguimiento };
