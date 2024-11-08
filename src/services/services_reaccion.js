const Publicacion = require('../models/publicaciones');
const ReaccionesUsuarios = require('../models/reaccionrelacion');
const Usuario = require('../models/usuarios');
const Notificaciones = require('../models/notificaciones');
const WebSocket = require('ws');
const { asociarNotificacionConUsuario } = require('./services_notificaciones');

const actualizarReaccion = async (id_publicacion, tipo_reaccion, wssReacciones, id_usuario) => {
  try {
    const publicacion = await Publicacion.findByPk(id_publicacion);
    if (!publicacion) {
      throw new Error("Publicación no encontrada");
    }

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    let reaccionExistente = await ReaccionesUsuarios.findOne({
      where: { id_publicacion, id_usuario }
    });

    let haReaccionado = false;

    if (reaccionExistente) {
      await reaccionExistente.destroy();
      haReaccionado = false;

      if (tipo_reaccion === 'me_gusta' && publicacion.me_gusta > 0) {
        publicacion.me_gusta -= 1;
      } else if (tipo_reaccion === 'disgusta' && publicacion.disgusta > 0) {
        publicacion.disgusta -= 1;
      }
    } else {
      await ReaccionesUsuarios.create({
        id_publicacion,
        id_usuario,
        tipo_reaccion
      });

      haReaccionado = true;

      if (tipo_reaccion === 'me_gusta') {
        publicacion.me_gusta += 1;
        await crearNotificacion(publicacion, usuario);
      } else if (tipo_reaccion === 'disgusta') {
        publicacion.disgusta += 1;
      }
    }

    await publicacion.save();

    if (wssReacciones && wssReacciones.clients) {
      wssReacciones.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'actualizacion_reaccion',
            reaccion: tipo_reaccion,
            conteo: tipo_reaccion === 'me_gusta' ? publicacion.me_gusta : publicacion.disgusta,
            id_usuario: id_usuario
          }));
        }
      });
    }

    return { publicacion, haReaccionado };
  } catch (error) {
    throw error;
  }
};

async function crearNotificacion(publicacion, usuario) {
  try {
    const mensaje = `Tu publicación ha recibido un "Me gusta" de ${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}`;

    const notificacion = await Notificaciones.create({
      tipo: 'me_gusta',
      mensaje: mensaje,
      id_creador: usuario.id,
      id_referencia_tipo: publicacion.id_publicacion,
      fecha_creacion: new Date(),
    });

    await asociarNotificacionConUsuario(notificacion.id_notificacion, publicacion.id_usuario);

  } catch{
  }
}

module.exports = {
  actualizarReaccion,
  crearNotificacion
};
