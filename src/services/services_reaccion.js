const Publicacion = require('../models/publicaciones'); 
const Usuario = require('../models/usuarios'); // Importamos el modelo de Usuario
const Notificaciones = require('../models/notificaciones');
const WebSocket = require('ws'); 
const { asociarNotificacionConUsuario } = require('./services_notificaciones');

const actualizarReaccion = async (id_publicacion, tipo_reaccion, cancelar, wssReacciones, id_usuario) => { 
    try {
        const publicacion = await Publicacion.findByPk(id_publicacion);
        if (!publicacion) {
            throw new Error("Publicación no encontrada");
        }

        // Obtener el usuario que realizó la reacción
        const usuario = await Usuario.findByPk(id_usuario);
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }

        // Lógica para actualizar las reacciones
        if (cancelar === true) { 
            if (tipo_reaccion === 'me_gusta' && publicacion.me_gusta > 0) {
                publicacion.me_gusta -= 1; 
            } else if (tipo_reaccion === 'disgusta' && publicacion.disgusta > 0) {
                publicacion.disgusta -= 1; 
            }
        } else {
            if (tipo_reaccion === 'me_gusta') {
                publicacion.me_gusta += 1; 
                // Crear notificación si es un "me gusta"
                await crearNotificacion(publicacion, usuario);
            } else if (tipo_reaccion === 'disgusta') {
                publicacion.disgusta += 1; 
            }
        }

        await publicacion.save();

        // Enviar actualización a los clientes WebSocket, incluyendo el id_usuario
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

        return publicacion; 
    } catch (error) {
        throw error; 
    }
};

// Crear notificación para "me gusta"
async function crearNotificacion(publicacion, usuario) {
    try {
        // Se crea la notificación solo si es un "me gusta"
        const mensaje = `Tu publicación ha recibido un "Me gusta" de ${usuario.nombre}`;

        const notificacion = await Notificaciones.create({
            tipo: 'me_gusta',  // Tipo de notificación
            mensaje: mensaje, 
            id_creador: usuario.id,  // ID del usuario que hace la reacción
            id_referencia_tipo: publicacion.id_publicacion,  // Referencia a la publicación
            fecha_creacion: new Date(),
        });

        // Enviar la notificación al usuario dueño de la publicación
        await asociarNotificacionConUsuario(notificacion.id_notificacion, publicacion.id_usuario);

    } catch (error) {
        console.error('Error al crear la notificación:', error);
    }
}

module.exports = {
    actualizarReaccion
};
