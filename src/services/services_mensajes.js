// En services_mensajes.js
const WebSocket = require('ws');
const Mensaje = require('../models/mensaje');
const Usuario = require('../models/usuarios');
const { Op, Sequelize } = require('sequelize');

async function validarUsuarios(idRemitente, idDestinatario) {
    try {
        console.log('Validando usuarios:', { idRemitente, idDestinatario });
        
        const remitente = await Usuario.findByPk(idRemitente);
        const destinatario = await Usuario.findByPk(idDestinatario);
        
        console.log('Resultado búsqueda:', {
            remitente: remitente ? 'encontrado' : 'no encontrado',
            destinatario: destinatario ? 'encontrado' : 'no encontrado'
        });

        if (!remitente || !destinatario) {
            console.log('Usuario no encontrado:', {
                remitenteExiste: !!remitente,
                destinatarioExiste: !!destinatario
            });
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error al validar usuarios:', error);
        return false;
    }
}

async function guardarMensaje(datosMensaje) {
    try {
        console.log('Datos recibidos:', datosMensaje);

        const usuariosValidos = await validarUsuarios(
            datosMensaje.idCliente, 
            datosMensaje.idChat
        );

        if (!usuariosValidos) {
            console.error('Validación de usuarios falló');
            throw new Error('Usuario remitente o destinatario no encontrado');
        }

        const mensaje = await Mensaje.create({
            id_remitente: datosMensaje.idCliente,
            id_destinatario: datosMensaje.idChat,
            mensaje: datosMensaje.mensaje,
            fecha_envio: new Date(),
            leido: false
        });

        console.log('Mensaje guardado:', mensaje.toJSON());
        return mensaje;
    } catch (error) {
        console.error('Error detallado al guardar mensaje:', {
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
}
// En services_mensajes.js
async function obtenerMensajes(idUsuario, idChat) {
    try {
        console.log(`Obteniendo mensajes para usuario ${idUsuario} con chat ${idChat}`);
        
        const mensajes = await Mensaje.findAll({
            where: {
                [Op.or]: [
                    {
                        id_remitente: idUsuario,
                        id_destinatario: idChat
                    },
                    {
                        id_remitente: idChat,
                        id_destinatario: idUsuario
                    }
                ]
            },
            include: [
                {
                    model: Usuario,
                    as: 'remitente',
                    attributes: ['id', 'nombre']
                },
                {
                    model: Usuario,
                    as: 'destinatario',
                    attributes: ['id', 'nombre']
                }
            ],
            attributes: [
                'id',
                'mensaje',
                'fecha_envio',
                'id_remitente',
                'id_destinatario'
            ],
            order: [['fecha_envio', 'ASC']]
        });

        // Separar mensajes enviados y recibidos
        const mensajesFormateados = mensajes.map(mensaje => {
            const mensajeJSON = mensaje.toJSON();
            const tipo = mensajeJSON.id_remitente === parseInt(idUsuario) ? 'enviado' : 'recibido';
            
            console.log(`Mensaje ${tipo}:`, {
                id: mensajeJSON.id,
                remitente: mensajeJSON.remitente?.nombre,
                destinatario: mensajeJSON.destinatario?.nombre,
                mensaje: mensajeJSON.mensaje,
                fecha: mensajeJSON.fecha_envio
            });

            return {
                id: mensajeJSON.id,
                mensaje: mensajeJSON.mensaje,
                fecha_envio: mensajeJSON.fecha_envio,
                id_remitente: mensajeJSON.id_remitente,
                id_destinatario: mensajeJSON.id_destinatario,
                remitente: mensajeJSON.remitente,
                destinatario: mensajeJSON.destinatario,
                tipo: tipo
            };
        });

        console.log(`Total mensajes encontrados: ${mensajesFormateados.length}`);
        console.log(`Mensajes enviados: ${mensajesFormateados.filter(m => m.tipo === 'enviado').length}`);
        console.log(`Mensajes recibidos: ${mensajesFormateados.filter(m => m.tipo === 'recibido').length}`);

        return mensajesFormateados;

    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        throw error;
    }
}
const conexionesActivas = new Map();
// En services_mensajes.js
async function manejarConexion(ws, req, wss, idUsuario, idChat) {
    try {
        // Guardar la conexión activa usando solo el ID del usuario
        const chatKey = `${idUsuario}`;
        conexionesActivas.set(chatKey, ws);
        console.log('Usuario conectado:', idUsuario);
        console.log('Conexiones activas:', Array.from(conexionesActivas.keys()));

        // Obtener historial de mensajes
        const mensajes = await obtenerMensajes(idUsuario, idChat);
        ws.send(JSON.stringify({ mensajes }));

        // Manejar mensajes entrantes
        ws.on('message', async (mensaje) => {
            try {
                const datosMensaje = JSON.parse(mensaje);
                const mensajeGuardado = await guardarMensaje(datosMensaje);
                console.log('Mensaje guardado:', mensajeGuardado);

                // Enviar confirmación al remitente
                ws.send(JSON.stringify(mensajeGuardado));

                // Enviar al destinatario si está conectado
                const destinatarioKey = `${datosMensaje.idChat}`; // Usar solo el ID del destinatario
                const wsDestinatario = conexionesActivas.get(destinatarioKey);
                
                console.log('Buscando destinatario:', destinatarioKey);
                console.log('Destinatario encontrado:', !!wsDestinatario);

                if (wsDestinatario && wsDestinatario.readyState === WebSocket.OPEN) {
                    console.log('Enviando mensaje al destinatario');
                    wsDestinatario.send(JSON.stringify(mensajeGuardado));
                } else {
                    console.log('Destinatario no conectado o websocket cerrado');
                }
            } catch (error) {
                console.error('Error procesando mensaje:', error);
                ws.send(JSON.stringify({ 
                    error: 'Error al procesar mensaje',
                    detalle: error.message 
                }));
            }
        });

        ws.on('error', (error) => {
            console.error('Error en WebSocket:', error);
        });

        // Limpiar conexión al cerrar
        ws.on('close', () => {
            conexionesActivas.delete(chatKey);
            console.log(`Usuario ${idUsuario} desconectado`);
            console.log('Conexiones activas restantes:', Array.from(conexionesActivas.keys()));
        });

    } catch (error) {
        console.error('Error en manejo de conexión:', error);
        ws.close();
    }
}

async function enviarMensaje(datosMensaje) {
    try {
        // Validar que los datos necesarios estén presentes
        if (!datosMensaje.idCliente || !datosMensaje.idChat || !datosMensaje.mensaje) {
            throw new Error('Faltan datos requeridos para el mensaje');
        }

        // Validar usuarios
        const usuariosValidos = await validarUsuarios(
            datosMensaje.idCliente, 
            datosMensaje.idChat
        );

        if (!usuariosValidos) {
            throw new Error('Usuario remitente o destinatario no encontrado');
        }

        // Crear el mensaje en la base de datos
        const mensaje = await Mensaje.create({
            id_remitente: datosMensaje.idCliente,
            id_destinatario: datosMensaje.idChat,
            mensaje: datosMensaje.mensaje,
            fecha_envio: new Date(),
            leido: false
        });

        return mensaje;
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        throw error;
    }
}

// Agregar al module.exports
module.exports = {
    guardarMensaje,
    obtenerMensajes,
    manejarConexion,
    enviarMensaje,

};