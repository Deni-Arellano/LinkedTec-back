const Mensaje = require('../models/mensaje');
const Usuario = require('../models/usuarios');
const { Op, Sequelize } = require('sequelize');

async function obtenerDatosChat(idUsuario) {
    try {
        console.log(`Obteniendo chats para el usuario ID: ${idUsuario}`);

        // Obtener todos los últimos mensajes para cada chat del usuario
        const chats = await Mensaje.findAll({
            where: {
                [Op.or]: [
                    { id_remitente: idUsuario },
                    { id_destinatario: idUsuario }
                ]
            },
            attributes: [
                'id_remitente',
                'id_destinatario',
                [Sequelize.fn('MAX', Sequelize.col('fecha_envio')), 'fecha_envio']
            ],
            group: ['id_remitente', 'id_destinatario'],
            order: [[Sequelize.literal('fecha_envio'), 'DESC']]
        });

        console.log(`Chats encontrados: ${chats.length}`);

        if (!chats.length) {
            console.log('No se encontraron chats para el usuario:', idUsuario);
            return [];
        }

        // Mapear cada chat para obtener los datos necesarios
        const datosChats = await Promise.all(chats.map(async (chat, index) => {
            console.log(`\nProcesando chat ${index + 1}/${chats.length}: Remitente ID ${chat.id_remitente}, Destinatario ID ${chat.id_destinatario}`);

            const ultimoMensaje = await Mensaje.findOne({
                where: {
                    [Op.or]: [
                        { id_remitente: idUsuario, id_destinatario: chat.id_remitente },
                        { id_remitente: chat.id_remitente, id_destinatario: idUsuario }
                    ]
                },
                order: [['fecha_envio', 'DESC']],
                attributes: ['mensaje', 'fecha_envio', 'id_remitente', 'id_destinatario']
            });

            console.log(`Ultimo mensaje encontrado: ${ultimoMensaje ? JSON.stringify(ultimoMensaje) : 'No se encontró mensaje'}`);

            if (!ultimoMensaje) {
                console.warn(`No se encontró el último mensaje para el chat entre usuario ID ${idUsuario} y usuario ID ${chat.id_remitente}`);
                return null; // O puedes elegir omitir este chat
            }

            // Determinar quién es el otro usuario en el chat
            const otroUsuarioId = (ultimoMensaje.id_remitente === idUsuario) ? ultimoMensaje.id_destinatario : ultimoMensaje.id_remitente;
            console.log(`Otro usuario ID en el chat: ${otroUsuarioId}`);

            const usuario = await Usuario.findOne({
                where: { id: otroUsuarioId },
                attributes: ['id', 'nombre'] // Eliminado 'foto_perfil'
            });

            if (!usuario) {
                console.warn(`No se encontró el usuario con ID ${otroUsuarioId}`);
                return null; // O puedes elegir omitir este chat
            }

            return {
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre
                    // Eliminado 'foto_perfil'
                },
                ultimoMensaje: {
                    texto: ultimoMensaje.mensaje,
                    fecha: ultimoMensaje.fecha_envio
                }
            };
        }));

        // Filtrar los chats que no son nulos
        const chatsFiltrados = datosChats.filter(chat => chat !== null);
        console.log(`Chats finales a retornar: ${chatsFiltrados.length}`);

        return chatsFiltrados;

    } catch (error) {
        console.error('Error al obtener datos del chat:', error);
        throw error;
    }
}

module.exports = { obtenerDatosChat };