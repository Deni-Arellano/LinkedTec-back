const { handleConnection, getMessages } = require('../services/services_mensajes'); 

function setupWebSocketServer(wss) {
    wss.on('connection', async (ws, req) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const userId = url.searchParams.get('userId'); 
        const pathParts = url.pathname.split('/');
        const chatId = pathParts[pathParts.length - 1]; 

        console.log(`Usuario ${userId} conectado al chat ${chatId}`);

        const userExists = await handleConnection(ws, req, wss, userId, chatId);

        if (!userExists) {
            ws.send(JSON.stringify({
                from: 'server',
                to: userId,
                message: `Error: Usuario o chat no encontrado`
            }));
            ws.close();
            return;
        }

        // Obtener mensajes históricos
        const messages = await getMessages(userId, chatId);
        ws.send(JSON.stringify({
            from: 'server',
            to: userId,
            messages: messages
        }));

        // Enviar un mensaje de bienvenida al usuario
        ws.send(JSON.stringify({
            from: 'server',
            to: userId,
            message: `Bienvenido al chat ${chatId}`
        }));
    });
}

module.exports = { setupWebSocketServer };