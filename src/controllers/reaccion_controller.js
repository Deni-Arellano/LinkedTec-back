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

 
    const reaccionExistente = await ReaccionesUsuarios.findOne({
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
      } else if (tipo_reaccion === 'disgusta') {
        publicacion.disgusta += 1;
      }
    }

    await publicacion.save();

   t
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

module.exports = {
  actualizarReaccion
};
