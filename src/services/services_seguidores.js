const Seguimiento = require('../models/seguidores');
const Usuario = require('../models/usuarios');
const Publicacion = require('../models/publicaciones');
const Reclutador = require('../models/reclutadores');
const { crearNotificacion, asociarNotificacionConUsuario } = require('../services/services_notificaciones');


const getUsuariosSeguidosService = async (id_usuario, limit, offset) => {
    const { count, rows: seguimientos } = await Seguimiento.findAndCountAll({
        where: { id_usuario },
        include: [{
            model: Usuario,
            as: 'perfilSeguido',
            attributes: ['id', 'nombre', 'apellido_paterno', 'apellido_materno', 'role', 'imagen_usuario']
        }],
        order: [['fecha_seguimiento', 'DESC']],
        limit,
        offset
    });

    return {
        total: count,
        usuariosSeguidos: seguimientos.map(seguimiento => seguimiento.perfilSeguido)
    };
};


const getPerfilUsuarioService = async (id_usuario) => {
   
    const publicaciones = await Publicacion.findAll({
        where: { id_usuario },
        attributes: ['id_publicacion', 'descripcion', 'imagen', 'fecha', 'me_gusta', 'disgusta'],
        order: [['fecha', 'DESC']]
    });

  
    const usuario = await Usuario.findByPk(id_usuario, {
        attributes: [
            'id', 'nombre', 'apellido_paterno', 'apellido_materno', 'role', 
            'fecha_nacimiento', 'correo', 'telefono', 'biografia', 'sexo', 
            'imagen_usuario'
        ]
    });

    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }


    if (usuario.role === 'Reclutadores') {
        const reclutador = await Reclutador.findOne({
            where: { id: usuario.id },
            attributes: ['nombre_empresa', 'sede', 'giro']
        });

        if (reclutador) {
            usuario.dataValues.nombre_empresa = reclutador.nombre_empresa;
            usuario.dataValues.sede = reclutador.sede;
            usuario.dataValues.giro = reclutador.giro;
        }
    }

    return { usuario, publicaciones };
};




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

module.exports = { seguir, dejarDeSeguir,    getUsuariosSeguidosService, getPerfilUsuarioService };
