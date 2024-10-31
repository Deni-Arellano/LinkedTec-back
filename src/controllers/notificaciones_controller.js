const { procesarNotificaciones } = require('../services/services_notificaciones');

function manejodeconexion_notificaciones(wss, ws) {
    console.log('Cliente conectado para notificaciones');


    ws.on('message', (message) => {
        procesarNotificaciones(wss, ws, message);
    });


    ws.on('close', () => {
        console.log('Cliente desconectado de notificaciones');
    });


    ws.on('error', (error) => {
        console.error('Error en la conexión del cliente de notificaciones:', error);
    });
}

module.exports = {
    manejodeconexion_notificaciones,
};
