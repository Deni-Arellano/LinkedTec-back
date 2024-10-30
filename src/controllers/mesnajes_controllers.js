
const {processMessage}= require('../services/services_mensajes');

function handleConnection(wss, ws) {
    console.log('Cliente conectado');

    ws.on('message', (message) =>processMessage(wss, ws, message));

    ws.on('close', () => {
        console.log('Cliente desconectado');
       
    });

    ws.on('error', (error) => {
        console.error('Error en la conexión del cliente:', error);
    });
}

module.exports = {
    handleConnection,
};
