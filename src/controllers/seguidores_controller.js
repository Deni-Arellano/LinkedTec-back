const seguidoresService = require('../services/services_seguidores');
const Seguimiento = require('../models/seguidores');
const Usuario = require('../models/usuarios');


const getUsuariosSeguidos = async (req, res) => {
    const { id_usuario } = req.params;
    const { pagina = 1, limite = 10 } = req.query; // Valores por defecto para página y límite
    const offset = (pagina - 1) * limite;

    try {
        const { total, usuariosSeguidos } = await seguidoresService.getUsuariosSeguidosService(id_usuario, parseInt(limite), parseInt(offset));
        const total_paginas = Math.ceil(total / limite);

        const pagina_siguiente = {
            url: pagina < total_paginas ? `http://localhost:3000/seguidores/usuarios/${id_usuario}/seguidos?pagina=${parseInt(pagina) + 1}&limite=${limite}` : null,
            exists: pagina < total_paginas,
        };

        const pagina_anterior = {
            url: pagina > 1 ? `http://localhost:3000/seguidores/usuarios/${id_usuario}/seguidos?pagina=${pagina - 1}&limite=${limite}` : null,
            exists: pagina > 1,
        };

        return res.json({
            total,
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            total_paginas,
            pagina_siguiente,
            pagina_anterior,
            usuariosSeguidos,
        });
    } catch (error) {
        console.error('Error al obtener los usuarios seguidos:', error);
        return res.status(500).json({ message: 'Error al obtener los usuarios seguidos' });
    }
};




const getPerfilUsuario = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const usuario = await seguidoresService.getPerfilUsuarioService(id_usuario);
        return res.json(usuario);
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        return res.status(500).json({ message: 'Error al obtener el perfil del usuario' });
    }
};


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

module.exports = { gestionarSeguimiento, getUsuariosSeguidos,getPerfilUsuario };
