// src/services/services_mensajes.js
const Mensaje = require('../models/mensaje'); // Asegúrate de que la ruta sea correcta
const WebSocket = require('ws');

async function procesamientomensajes(wss, ws, message) {
    console.log('Mensaje recibido del cliente:', message);

    try {
        const data = JSON.parse(message);
        
        // Verifica que los campos necesarios existan
        if (!data.sender || !data.recipient || !data.content) {
            throw new Error('Faltan campos necesarios en el mensaje');
        }

        console.log('Mensaje procesado:', data);

        // Guardar el mensaje en la base de datos usando el modelo
        await Mensaje.create({
            id_remitente: data.sender,
            id_destinatario: data.recipient,
            mensaje: data.content,
        });

        // Enviar el mensaje a todos los clientes excepto al que lo envió
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
                client.send(JSON.stringify(data));
            }
        });
    } catch (error) {
        console.error('Error al procesar el mensaje:', error);
        // Aquí puedes enviar un mensaje de error específico al cliente
        ws.send(JSON.stringify({ type: 'error', content: 'Error al procesar el mensaje: ' + error.message }));
    }
}

module.exports = { procesamientomensajes };
