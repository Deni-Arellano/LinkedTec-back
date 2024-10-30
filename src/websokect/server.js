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

            // Envía el mensaje a todos los clientes conectados
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data)); // Reenvía el mensaje recibido a todos los clientes
                }
            });
        } catch (error) {
            console.error('Error al analizar el mensaje:', error);
            ws.send(JSON.stringify({ type: 'error', content: 'Error al procesar el mensaje.' }));
        }
    });

    // Notifica al cliente cuando la conexión se cierra
    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

console.log('Servidor WebSocket en funcionamiento en ws://localhost:8080');
