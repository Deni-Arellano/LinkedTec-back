const Mensaje = require('../models/mensaje');
const Usuario = require('../models/usuarios');
const { Op, Sequelize } = require('sequelize');

const conexionesActivas = new Map();

async function obtenerDatosChat(idUsuario) {
    try {
        const mensajes = await Mensaje.findAll({
            where: {
                [Op.or]: [
                    { id_remitente: idUsuario },
                    { id_destinatario: idUsuario }
                ]
            },
            order: [['fecha_envio', 'DESC']],
            include: [
                { model: Usuario, as: 'remitente', attributes: ['id', 'nombre', 'imagen_usuario'] },
                { model: Usuario, as: 'destinatario', attributes: ['id', 'nombre', 'imagen_usuario'] }
            ]
        });

        const mensajesUnicos = new Map();

        mensajes.forEach((mensaje) => {
            const key = `${Math.min(mensaje.id_remitente, mensaje.id_destinatario)}-${Math.max(mensaje.id_remitente, mensaje.id_destinatario)}`;

            if (!mensajesUnicos.has(key)) {
                const remitenteData = mensaje.remitente ?? { id: null, nombre: 'Remitente desconocido', imagen_usuario: null };
                const destinatarioData = mensaje.destinatario ?? { id: null, nombre: 'Destinatario desconocido', imagen_usuario: null };

                if (!remitenteData.id || !destinatarioData.id) {
                    console.error('Datos del chat incompletos:', { mensajeId: mensaje.id });
                    return;
                }

                const chatData = {
                    id: mensaje.id,
                    id_remitente: mensaje.id_remitente,
                    id_destinatario: mensaje.id_destinatario,
                    mensaje: mensaje.mensaje,
                    fecha_envio: mensaje.fecha_envio,
                    usuario: {
                        id: parseInt(idUsuario) === mensaje.id_remitente ? 
                            mensaje.destinatario.dataValues.id : mensaje.remitente.dataValues.id,
                        nombre: parseInt(idUsuario) === mensaje.id_remitente ? 
                            mensaje.destinatario.dataValues.nombre : mensaje.remitente.dataValues.nombre,
                        imagen_usuario: parseInt(idUsuario) === mensaje.id_remitente ? 
                            mensaje.destinatario.dataValues.imagen_usuario : mensaje.remitente.dataValues.imagen_usuario
                    }
                };
                mensajesUnicos.set(key, chatData);
            }
        });
        return Array.from(mensajesUnicos.values());
    } catch (error) {
        console.error('Error al obtener datos del chat:', error.message);
        throw error;
    }
}

async function manejarConexion(ws, req, wss, idUsuario) {
    try {
        const chatKey = `${idUsuario}`;

        // Verificar si ya existe una conexión para este usuario
        if (conexionesActivas.has(chatKey)) {
            const conexionExistente = conexionesActivas.get(chatKey);
            conexionExistente.close(); // Cerrar la conexión existente
            conexionesActivas.delete(chatKey); // Eliminar la conexión existente del mapa
            console.log(`Conexión existente para el usuario ${idUsuario} cerrada.`);
        }

        conexionesActivas.set(chatKey, ws);


        // Consulta periódica a la base de datos
        const intervalId = setInterval(async () => {
            try {
                const datosChat = await obtenerDatosChat(idUsuario);
                ws.send(JSON.stringify({ tipo: 'datosChatActualizados', datos: datosChat }));
            } catch (error) {
                console.error('Error al obtener datos del chat:', error.message);
            }
        }, 10000); // Intervalo de 10 segundos

        ws.on('message', async (mensaje) => {
            try {
                const datosMensaje = JSON.parse(mensaje);
                console.log('Mensaje recibido:', datosMensaje);

                if (datosMensaje.tipo === 'obtenerDatosChat') {
                    const datosChat = await obtenerDatosChat(datosMensaje.idUsuario);
                    ws.send(JSON.stringify({ tipo: 'datosChat', datos: datosChat }));
                    return;
                }

                // Guardar el mensaje en la base de datos
                const nuevoMensaje = await Mensaje.create({
                    id_remitente: datosMensaje.id_remitente,
                    id_destinatario: datosMensaje.id_destinatario,
                    mensaje: datosMensaje.mensaje,
                    fecha_envio: new Date()
                });

                // Notificar al remitente que el mensaje fue enviado
                ws.send(JSON.stringify({
                    tipo: 'mensajeEnviado',
                    mensaje: nuevoMensaje
                }));

                // Notificar al destinatario si está conectado
                const destinatarioKey = `${datosMensaje.id_destinatario}`;
                const wsDestinatario = conexionesActivas.get(destinatarioKey);
                if (wsDestinatario && wsDestinatario.readyState === ws.OPEN) {
                   
                    wsDestinatario.send(JSON.stringify({
                        tipo: 'nuevoMensaje',
                        mensaje: nuevoMensaje
                    }));
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

        ws.on('close', () => {
            clearInterval(intervalId); // Detener la consulta periódica cuando se cierra la conexión
            conexionesActivas.delete(chatKey);

        });
    } catch (error) {
        console.error('Error en manejo de conexión:', error);
        ws.close();
    }
}

module.exports = { obtenerDatosChat, manejarConexion };