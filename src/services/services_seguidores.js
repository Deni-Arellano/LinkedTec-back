const Seguimiento = require('../models/seguidores');
const { crearNotificacion, asociarNotificacionConUsuario } = require('../services/services_notificaciones');
const Usuario = require('../models/usuarios');

const seguir = async (id_usuario, id_perfil_a_seguir) => {
  try {
    const seguimiento = await Seguimiento.findOne({
      where: { id_usuario, id_perfil_a_seguir },
    });

    if (seguimiento) {
      return { existe: true, seguimiento };
    }

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      throw new Error(`Usuario con ID ${id_usuario} no encontrado.`);
    }

    const nuevoSeguimiento = await Seguimiento.create({
      id_usuario,
      id_perfil_a_seguir,
    });

    const mensaje = `Te ha comenzado a seguir "${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}"`;

    const notificacion = await crearNotificacion({
      tipo: 'seguimiento',
      mensaje,
      id_creador: id_usuario,
      id_referencia_tipo: nuevoSeguimiento.id_seguidores,
    });

    await asociarNotificacionConUsuario(notificacion.id_notificacion, id_perfil_a_seguir);

    return { existe: false, seguimiento: nuevoSeguimiento };
  } catch (error) {
    throw new Error('Error al buscar o crear seguimiento: ' + error.message);
  }
};

const dejarDeSeguir = async (seguimiento) => {
  try {
    await seguimiento.destroy();
    return true;
  } catch (error) {
    throw new Error('Error al eliminar el seguimiento: ' + error.message);
  }
};

module.exports = { seguir, dejarDeSeguir };
