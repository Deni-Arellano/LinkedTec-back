const { QueryTypes } = require('sequelize'); // Importa QueryTypes desde Sequelize
const sequelize = require('../config/database'); // Importa la conexión a la base de datos
const Mensaje = require('../models/mensaje'); // Importa el modelo Mensaje
const Usuario = require('../models/usuarios'); // Importa el modelo Usuario

async function saveMessage(message) {
    try {
        // Crear un nuevo mensaje en la base de datos
        const nuevoMensaje = await Mensaje.create({
            id_remitente: message.clientId,
            id_destinatario: message.chatId,
            mensaje: message.message,
            fecha_envio: new Date()
        });
        console.log('Mensaje guardado:', nuevoMensaje);
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
    }
}

async function getMessages(userId, chatId) {
    try {
        // Obtener mensajes históricos entre los dos usuarios usando una consulta SQL
        const messages = await sequelize.query(
            `SELECT * FROM mensajes WHERE (id_remitente = :userId AND id_destinatario = :chatId) OR (id_remitente = :chatId AND id_destinatario = :userId) ORDER BY fecha_envio ASC`,
            {
                replacements: { userId, chatId },
                type: QueryTypes.SELECT
            }
        );
        console.log(`Mensajes históricos entre ${userId} y ${chatId}:`, messages);
        return messages;
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        return [];
    }
}

async function handleConnection(ws, req, wss, userId, chatId) {
    console.log(`Nuevo cliente conectado: Usuario ${userId} en el chat ${chatId}`);

    // Verificar si los IDs de usuario existen
    const user = await Usuario.findByPk(userId);
    const chatUser = await Usuario.findByPk(chatId);

    if (!user || !chatUser) {
        console.log(`Error: Usuario ${userId} o chat ${chatId} no encontrado`);
        return false;
    }

    ws.on('message', async (message) => {
        console.log(`Mensaje recibido del usuario ${userId} en el chat ${chatId}:`, message);

        // Manejar el mensaje recibido
        const parsedMessage = JSON.parse(message);
        await saveMessage(parsedMessage);

        // Reenviar el mensaje a todos los clientes conectados
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                const processedMessage = JSON.stringify({
                    from: parsedMessage.clientId,
                    to: parsedMessage.chatId,
                    message: parsedMessage.message
                });
                console.log(`Reenviando mensaje a cliente:`, processedMessage);
                client.send(processedMessage);
            }
        });
    });

    ws.on('close', () => {
        console.log(`Cliente desconectado: Usuario ${userId} del chat ${chatId}`);
    });

    return true;
}

module.exports = { handleConnection, saveMessage, getMessages };