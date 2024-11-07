const Publicacion = require('../models/publicaciones'); // Importa el modelo de Publicación
const WebSocket = require('ws'); // Importa la librería ws para WebSockets

const actualizarReaccion = async (id_publicacion, tipo_reaccion, cancelar, wssReacciones) => {
    try {
        const publicacion = await Publicacion.findByPk(id_publicacion);
        if (!publicacion) {
            throw new Error("Publicación no encontrada");
        }

        if (cancelar === true) { 
            if (tipo_reaccion === 'me_gusta' && publicacion.me_gusta > 0) {
                publicacion.me_gusta -= 1; 
            } else if (tipo_reaccion === 'disgusta' && publicacion.disgusta > 0) {
                publicacion.disgusta -= 1; 
            }
        } else {
            if (tipo_reaccion === 'me_gusta') {
                publicacion.me_gusta += 1; 
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
                        conteo: tipo_reaccion === 'me_gusta' ? publicacion.me_gusta : publicacion.disgusta
                    }));
                }
            });
        }

        return publicacion; 
    } catch (error) {
        throw error; 
    }
};

module.exports = {
    actualizarReaccion
};
