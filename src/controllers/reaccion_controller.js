const Publicacion = require('../models/publicaciones');
const ReaccionesUsuarios = require('../models/reaccionrelacion');
const Usuario = require('../models/usuarios');
const WebSocket = require('ws');

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

    // Consultar si el usuario ya ha reaccionado a la publicación
    const reaccionExistente = await ReaccionesUsuarios.findOne({
      where: { id_publicacion, id_usuario }
    });

    let haReaccionado = false; // Bandera por defecto

    if (reaccionExistente) {
      // Si ya hay una reacción existente, la eliminamos (es como quitar el like)
      await reaccionExistente.destroy();

      haReaccionado = false; // Ahora el usuario ya no tiene reacción

      // Actualizamos el conteo de reacciones en la publicación
      if (tipo_reaccion === 'me_gusta' && publicacion.me_gusta > 0) {
        publicacion.me_gusta -= 1;
      } else if (tipo_reaccion === 'disgusta' && publicacion.disgusta > 0) {
        publicacion.disgusta -= 1;
      }
    } else {
      // Si no hay reacción existente, se crea una nueva
      await ReaccionesUsuarios.create({
        id_publicacion,
        id_usuario,
        tipo_reaccion
      });

      haReaccionado = true; // El usuario ahora tiene una reacción

      // Actualizamos el conteo de reacciones en la publicación
      if (tipo_reaccion === 'me_gusta') {
        publicacion.me_gusta += 1;
      } else if (tipo_reaccion === 'disgusta') {
        publicacion.disgusta += 1;
      }
    }

    await publicacion.save();

    // Enviar actualización a los clientes WebSocket
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

    // Devolver la publicación junto con la bandera haReaccionado
    return { publicacion, haReaccionado };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  actualizarReaccion
};
