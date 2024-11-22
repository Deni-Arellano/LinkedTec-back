const Seguimiento = require('../models/seguidores');
const Usuario = require('../models/usuarios');
const Publicacion = require('../models/publicaciones');
const Reclutador = require('../models/reclutadores');


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

module.exports = {
    getUsuariosSeguidosService,
    getPerfilUsuarioService
};