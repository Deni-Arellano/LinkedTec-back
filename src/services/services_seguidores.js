
const Seguimiento = require('../models/seguidores');

const seguir = async (id_usuario, id_perfil_a_seguir) => {
  try {
    const seguimiento = await Seguimiento.findOne({
      where: { id_usuario, id_perfil_a_seguir },
    });

    if (seguimiento) {
      return { existe: true, seguimiento };
    }

    const nuevoSeguimiento = await Seguimiento.create({
      id_usuario,
      id_perfil_a_seguir,
    });

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
