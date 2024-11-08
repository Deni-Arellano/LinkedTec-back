const Publicacion = require('../models/publicaciones');
const ReaccionesUsuarios = require('../models/reaccionrelacion');
const WebSocket = require('ws');

const actualizarReaccion = async (id_publicacion, tipo_reaccion, cancelar, wssReacciones, id_usuario) => {
  try {
    const publicacion = await Publicacion.findByPk(id_publicacion);
    if (!publicacion) {
      throw new Error("Publicación no encontrada");
    }

    // Buscar si el usuario ya ha reaccionado a la publicación
    let reaccionExistente = await ReaccionesUsuarios.findOne({
      where: { id_publicacion, id_usuario }
    });

    // Bandera para indicar si el usuario ya ha reaccionado
    let haReaccionado = !!reaccionExistente; // True si hay una reacción existente, false si no

    if (cancelar) {
      // Si es una cancelación, eliminar la reacción existente si hay una
      if (reaccionExistente) {
        await reaccionExistente.destroy();
        haReaccionado = false; // Ahora el usuario no ha reaccionado
        if (tipo_reaccion === 'me_gusta' && publicacion.me_gusta > 0) {
          publicacion.me_gusta -= 1;
        } else if (tipo_reaccion === 'disgusta' && publicacion.disgusta > 0) {
          publicacion.disgusta -= 1;
        }
      }
    } else {
      // Si no hay una reacción existente, crear una nueva
      if (!reaccionExistente) {
        await ReaccionesUsuarios.create({
          id_publicacion,
          id_usuario,
          tipo_reaccion
        });
        haReaccionado = true; // Ahora el usuario ha reaccionado
        if (tipo_reaccion === 'me_gusta') {
          publicacion.me_gusta += 1;
        } else if (tipo_reaccion === 'disgusta') {
          publicacion.disgusta += 1;
        }
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
