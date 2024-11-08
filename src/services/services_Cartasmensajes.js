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
                { model: Usuario, as: 'remitente', attributes: ['id', 'nombre'] },
                { model: Usuario, as: 'destinatario', attributes: ['id', 'nombre'] }
            ]
        });

        const mensajesUnicos = new Map();

        mensajes.forEach((mensaje) => {
            const key = `${Math.min(mensaje.id_remitente, mensaje.id_destinatario)}-${Math.max(mensaje.id_remitente, mensaje.id_destinatario)}`;

            if (!mensajesUnicos.has(key)) {
                const remitenteData = mensaje.remitente ?? { id: null, nombre: 'Remitente desconocido' };
                const destinatarioData = mensaje.destinatario ?? { id: null, nombre: 'Destinatario desconocido' };

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
                        // Invertir la lógica: Si soy remitente (1), mostrar destinatario (3)
                        id: parseInt(idUsuario) === mensaje.id_remitente ? 
                            mensaje.destinatario.dataValues.id : 
                            mensaje.remitente.dataValues.id,
                        nombre: parseInt(idUsuario) === mensaje.id_remitente ? 
                            mensaje.destinatario.dataValues.nombre : 
                            mensaje.remitente.dataValues.nombre
                    }
                };
                
                // Debug mejorado
                console.table({
                    ...chatData,
                    usuario_actual: idUsuario,
                    usuario_mostrado: `${chatData.usuario.id} (${chatData.usuario.nombre})`,
                    tipo_usuario: parseInt(idUsuario) === mensaje.id_remitente ? 'Remitente' : 'Destinatario'
                });

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
        conexionesActivas.set(chatKey, ws);
        console.log('Usuario conectado:', idUsuario);
        console.log('Conexiones activas:', Array.from(conexionesActivas.keys()));

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

                console.log('Buscando destinatario:', destinatarioKey);
                console.log('Destinatario encontrado:', !!wsDestinatario);

                if (wsDestinatario && wsDestinatario.readyState === ws.OPEN) {
                    console.log('Enviando mensaje al destinatario');
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
            conexionesActivas.delete(chatKey);
            console.log(`Usuario ${idUsuario} desconectado`);
            console.log('Conexiones activas restantes:', Array.from(conexionesActivas.keys()));
        });

    } catch (error) {
        console.error('Error en manejo de conexión:', error);
        ws.close();
    }
}



module.exports = { obtenerDatosChat, manejarConexion };