const WebSocket = require('ws');
const Usuario = require('../models/usuarios');
const { findChatsByUserId } = require('../services/services_mensajes2');
const { handleConnection, getMessages } = require('../services/services_mensajes');

async function handleWebSocketMessage(ws, data) {
    try {
        const { userId } = JSON.parse(data);

        // Validación inicial: Revisar si el ID de usuario está presente
        if (!userId) {
            ws.send(JSON.stringify({ error: 'Usuario null o chat no encontrado' }));
            ws.close();
            return;
        }

        // Consultar la base de datos para verificar si el usuario existe
        const userExists = await Usuario.findOne({ where: { id: userId } });

        if (userExists) {
            const result = await findChatsByUserId(userId);

            if (result.success) {
                console.log(`Usuario ${userId} tiene chats asociados`);
                ws.send(JSON.stringify({ message: 'Usuario tiene chats asociados', destinatarios: result.destinatarios }));
            } else {
                console.log(`Usuario ${userId} no tiene chats asociados`);
                ws.send(JSON.stringify({ message: 'Usuario no tiene chats asociados' }));
            }
        } else {
            ws.send(JSON.stringify({ error: 'Usuario no encontrado' }));
            ws.close();
        }
    } catch (error) {
        console.error('Error al manejar el mensaje:', error);
        ws.send(JSON.stringify({ error: 'Error interno del servidor' }));
        ws.close();
    }
}

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

module.exports = { setupWebSocketServer, handleWebSocketMessage };