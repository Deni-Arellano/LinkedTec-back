const Notificaciones = require('../models/notificaciones');
const NotificacionesUsuarios = require('../models/notificaciones_usuarios');
const Usuario = require('../models/usuarios');
const WebSocket = require('ws');
const { Op } = require('sequelize');

/**
 * Procesa las notificaciones recibidas del cliente.
 * @param {WebSocket.Server} wss - El servidor WebSocket.
 * @param {WebSocket} ws - La conexión WebSocket del cliente.
 * @param {string} message - El mensaje recibido desde el cliente.
 */
async function procesarNotificaciones(wss, ws, message) {
    try {
        const data = JSON.parse(message.toString());

        if (!data.tipo || !data.mensaje || !data.id_creador) {
            throw new Error('Datos de notificación incompletos');
        }

        const notificacionCreada = await crearNotificacion(data);

        await Promise.all(idsUsuarios.map(id_usuario => 
            asociarNotificacionConUsuario(notificacionCreada.id_notificacion, id_usuario)
        ));
    } catch (error) {
        ws.send(JSON.stringify({ error: 'Error procesando la notificación: ' + error.message }));
    }
}

/**
 * Crea una nueva notificación en la base de datos.
 * @param {Object} data - Los datos de la notificación.
 * @returns {Promise<Notificacion>} La notificación creada.
 */
async function crearNotificacion(data) {
    try {
        const notificacionCreada = await Notificaciones.create({
            tipo: data.tipo,
            mensaje: data.mensaje,
            id_creador: data.id_creador,
            id_referencia_tipo: data.id_referencia_tipo,
            fecha_creacion: new Date(),
        });
        return notificacionCreada;
    } catch (error) {
        throw new Error('Error al crear la notificación: ' + error.message);
    }
}

/**
 * Asocia una notificación con un usuario en la base de datos.
 * @param {number} idNotificacion - El ID de la notificación.
 * @param {number} idUsuario - El ID del usuario.
 */
async function asociarNotificacionConUsuario(idNotificacion, idUsuario) {
    try {
        await NotificacionesUsuarios.create({
            id_notificacion: idNotificacion,
            id_usuario: idUsuario
        });
    } catch (error) {
        throw new Error('Error al asociar la notificación con el usuario: ' + error.message);
    }
}

/**
 * Obtiene todos los IDs de usuarios registrados.
 * @returns {Promise<Array<number>>} Una promesa que resuelve con un arreglo de IDs de usuarios.
 */
async function obtenerIdsUsuariosNoticias() {
    try {
        const usuarios = await Usuario.findAll({ attributes: ['id'] });
        return usuarios.map(usuario => usuario.id);
    } catch (error) {
        throw new Error('Error al obtener los IDs de usuarios: ' + error.message);
    }
}


/**
 * Obtiene todos los IDs de usuarios con rol de Egresados y Estudiantes.
 * @returns {Promise<Array<number>>} Una promesa que resuelve con un arreglo de IDs de usuarios.
 */
async function obtenerIdsUsuariosEmpleo() {
    try {
        const usuarios = await Usuario.findAll({
            where: {
                role: {
                    [Op.or]: ['Egresados', 'Estudiantes'] 
                }
            },
            attributes: ['id']
        });
        return usuarios.map(usuario => usuario.id);
    } catch (error) {
        throw new Error('Error al obtener los IDs de usuarios: ' + error.message);
    }
}


/**
 * Envía las notificaciones a un usuario conectado en el WebSocket.
 * @param {WebSocket.Server} wss - El servidor WebSocket.
 * @param {number} id_usuario - El ID del usuario.
 */
async function enviarNotificacionesPorWebSocket(wss, id_usuario) {
    try {
        const notificaciones = await obtenerNotificacionesPorUsuario(id_usuario);

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client.id_usuario === id_usuario) {
                client.send(JSON.stringify({
                    type: 'notificaciones',
                    notificaciones
                }));
            }
        });
    } catch (error) {
        console.error('Error al enviar notificaciones por WebSocket:', error);
    }
}

/**
 * Obtiene todas las notificaciones para un usuario específico en orden descendente.
 * @param {number} id_usuario - El ID del usuario.
 * @returns {Promise<Array<Object>>} Una promesa que resuelve con un arreglo de notificaciones.
 */
async function obtenerNotificacionesPorUsuario(id_usuario) {
    try {
        const notificacionesUsuarios = await NotificacionesUsuarios.findAll({
            where: { id_usuario },
            include: [
                {
                    model: Notificaciones,
                    as: 'Notificaciones',
                    attributes: ['tipo', 'mensaje', 'fecha_creacion']
                }
            ],
            order: [[{ model: Notificaciones, as: 'Notificaciones' }, 'fecha_creacion', 'DESC']]
        });

        return notificacionesUsuarios.map(nu => nu.Notificaciones);
    } catch (error) {
        throw new Error('Error al obtener las notificaciones: ' + error.message);
    }
}



module.exports = {
    asociarNotificacionConUsuario,
    procesarNotificaciones,
    crearNotificacion,
    obtenerIdsUsuariosNoticias,
    obtenerIdsUsuariosEmpleo,
    obtenerNotificacionesPorUsuario,
    enviarNotificacionesPorWebSocket
};