const { QueryTypes } = require('sequelize');
const sequelize = require('../config/database');
const Mensaje = require('../models/mensaje');
const Usuario = require('../models/usuarios');

async function saveMessage(message) {
    try {
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

    const user = await Usuario.findByPk(userId);
    const chatUser = await Usuario.findByPk(chatId);

    if (!user || !chatUser) {
        console.log(`Error: Usuario ${userId} o chat ${chatId} no encontrado`);
        return false;
    }

    ws.on('message', async (message) => {
        console.log(`Mensaje recibido del usuario ${userId} en el chat ${chatId}:`, message);

        const parsedMessage = JSON.parse(message);
        await saveMessage(parsedMessage);

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

async function findChatsByUserId(userId) {
    try {
        const mensajes = await Mensaje.findAll({
            where: { id_remitente: userId },
            order: [['fecha_envio', 'DESC']]
        });

        if (mensajes.length > 0) {
            const destinatariosIds = [...new Set(mensajes.map(mensaje => mensaje.id_destinatario))];

            const destinatarios = await Usuario.findAll({
                where: {
                    id: destinatariosIds
                },
                attributes: ['id', 'nombre', 'apellido_paterno', 'apellido_materno', 'correo', 'imagen_usuario']
            });

            const destinatariosMap = destinatarios.reduce((map, destinatario) => {
                map[destinatario.id] = destinatario;
                return map;
            }, {});

            const destinatariosConUltimoMensaje = destinatariosIds.map(destinatarioId => {
                const ultimoMensaje = mensajes.find(mensaje => mensaje.id_destinatario === destinatarioId);
                return {
                    ...destinatariosMap[destinatarioId].dataValues,
                    ultimoMensaje: ultimoMensaje.mensaje,
                    fechaUltimoMensaje: ultimoMensaje.fecha_envio
                };
            });

            return { success: true, destinatarios: destinatariosConUltimoMensaje };
        } else {
            return { success: false, destinatarios: [] };
        }
    } catch (error) {
        console.error('Error al encontrar chats por ID de usuario:', error);
        return { success: false, destinatarios: [] };
    }
}

module.exports = { handleConnection, saveMessage, getMessages, findChatsByUserId };