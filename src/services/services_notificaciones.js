const Notificacion = require('../models/notificacion');
const WebSocket = require('ws');

async function procesarNotificaciones(wss, ws, message) {
    try {
        const data = JSON.parse(message.toString());
        
        if (!data.tipo || !data.mensaje || !data.id_usuario_emisor) {
            throw new Error('Datos de notificación incompletos');
        }

        const notificacionCreada = await crearNotificacion(data);

        enviarNotificacion(wss, notificacionCreada);

    } catch (error) {
        ws.send(JSON.stringify({ error: 'Error procesando la notificación: ' + error.message }));
    }
}

async function crearNotificacion(data) {
    try {
        const notificacionCreada = await Notificacion.create({
            tipo: data.tipo,
            mensaje: data.mensaje,
            id_usuario_emisor: data.id_usuario_emisor,
            id_usuario_destinatario: data.id_usuario_destinatario || null,
            id_referencia: data.id_referencia || null,
            visto: false,
            fecha: new Date(),
        });
        return notificacionCreada;
    } catch (error) {
        throw new Error('Error al crear la notificación: ' + error.message);
    }
}

async function enviarNotificacion(wss, notificacion) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && 
            notificacion.id_usuario_destinatario !== null) {
            client.send(JSON.stringify({
                id_notificacion: notificacion.id_notificacion,
                tipo: notificacion.tipo,
                mensaje: notificacion.mensaje,
                id_usuario_emisor: notificacion.id_usuario_emisor,
                id_usuario_destinatario: notificacion.id_usuario_destinatario,
                fecha: notificacion.fecha,
                visto: notificacion.visto,
            }));
        }
    });
}

module.exports = {
    procesarNotificaciones,
    crearNotificacion,
    enviarNotificacion,
};
