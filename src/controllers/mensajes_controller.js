const mensajesService = require('../services/services_mensajes');
const url = require('url');

class MensajesController {
    async enviarMensaje(req, res) {
        try {
            const datosMensaje = {
                idCliente: req.body.idCliente,
                idChat: req.body.idChat,
                mensaje: req.body.mensaje
            };

            const mensaje = await mensajesService.enviarMensaje(datosMensaje);
            res.status(201).json(mensaje);
        } catch (error) {
            console.error('Error en controlador - enviarMensaje:', error);
            res.status(400).json({ 
                error: error.message || 'Error al enviar mensaje' 
            });
        }
    }

    async obtenerMensajes(req, res) {
        try {
            const { idUsuario, idChat } = req.params;

            if (!idUsuario || !idChat) {
                return res.status(400).json({ 
                    error: 'Se requieren idUsuario e idChat' 
                });
            }

            const mensajes = await mensajesService.obtenerMensajes(
                parseInt(idUsuario), 
                parseInt(idChat)
            );
            res.json(mensajes);
        } catch (error) {
            console.error('Error en controlador - obtenerMensajes:', error);
            res.status(500).json({ 
                error: 'Error al obtener mensajes' 
            });
        }
    }

    async guardarMensaje(req, res) {
        try {
            const datosMensaje = {
                idCliente: req.body.idCliente,
                idChat: req.body.idChat,
                mensaje: req.body.mensaje
            };

            const mensajeGuardado = await mensajesService.guardarMensaje(datosMensaje);
            res.status(201).json(mensajeGuardado);
        } catch (error) {
            console.error('Error en controlador - guardarMensaje:', error);
            res.status(400).json({ 
                error: error.message || 'Error al guardar mensaje' 
            });
        }
    }

    // mensajes_controller2.js
    // Modificar el método establecerConexionWS
    async establecerConexionWS(ws, req, wss) {
        try {
            // Obtener parámetros de la URL query en lugar de params
            const parameters = url.parse(req.url, true).query;
            const idUsuario = parseInt(parameters.idUsuario);
            const idChat = parseInt(parameters.idChat);
    
            if (!idUsuario || !idChat) {
                console.error('Parámetros inválidos');
                ws.close();
                return;
            }
    
            await mensajesService.manejarConexion(
                ws, 
                req, 
                wss, 
                idUsuario, 
                idChat
            );
        } catch (error) {
            console.error('Error en controlador - establecerConexionWS:', error);
            ws.close();
        }
    }
}

module.exports = new MensajesController();