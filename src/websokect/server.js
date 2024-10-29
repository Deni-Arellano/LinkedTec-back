const WebSocket = require('ws');

// Configura el servidor WebSocket en el puerto 8080
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Cliente conectado');

    // Escucha mensajes enviados por el cliente
    ws.on('message', (message) => {
        console.log('Mensaje recibido del cliente:');

        try {
            const data = JSON.parse(message); // Asegúrate de que es JSON
            console.log('Mensaje procesado:', data);

            // Aquí puedes enviar una respuesta de vuelta como JSON
            const response = JSON.stringify({ type: 'response', content: 'Mensaje recibido correctamente' });
            ws.send(response);
        } catch (error) {
            console.error('Error al analizar el mensaje:', error);
            // Notificar al cliente que se recibió un Blob (si corresponde)
            if (message instanceof Blob) {
                ws.send(JSON.stringify({ type: 'error', content: 'Se recibió un Blob, no se puede procesar.' }));
            }
        }
    });

    // Notifica al cliente cuando la conexión se cierra
    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

console.log('Servidor WebSocket en funcionamiento en ws://localhost:8080');
