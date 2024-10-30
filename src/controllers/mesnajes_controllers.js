
const {procesamientomensajes}= require('../services/services_mensajes');

function manejodeconexion(wss, ws) {
    console.log('Cliente conectado');

    ws.on('message', (message) =>procesamientomensajes(wss, ws, message));

    ws.on('close', () => {
        console.log('Cliente desconectado');
       
    });

    ws.on('error', (error) => {
        console.error('Error en la conexión del cliente:', error);
    });
}

module.exports = {
    manejodeconexion,
};
