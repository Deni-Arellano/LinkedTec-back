// services/wsService.js
function processMessage(wss, ws, message) {
    console.log('Mensaje recibido del cliente:', message);

    try {
        const data = JSON.parse(message); 
        console.log('Mensaje procesado:', data);

        
        wss.clients.forEach(client => {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify(data)); 
            }
        });
    } catch (error) {
        console.error('Error al analizar el mensaje:', error);
        ws.send(JSON.stringify({ type: 'error', content: 'Error al procesar el mensaje.' }));
    }
}

module.exports = {
    processMessage,
};
