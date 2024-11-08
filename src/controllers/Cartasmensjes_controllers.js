const { obtenerDatosChat } = require('../services/services_Cartasmensajes');

class CartasMensajesController {
    async obtenerDatosChatHTTP(req, res) {
        const { idUsuario } = req.params;

        try {
            const datosChat = await obtenerDatosChat(idUsuario);
            res.status(200).json(datosChat);
        } catch (error) {
            console.error('Error en controlador - obtenerDatosChat:', error);
            res.status(500).json({ error: 'Error al obtener datos del chat' });
        }
    }

    establecerConexionWS(ws, req, wss) {
        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);

                if (data.tipo === 'obtenerDatosChat') {
                    const { idUsuario } = data;
                    const datosChat = await obtenerDatosChat(idUsuario);
                    
                    ws.send(JSON.stringify({ tipo: 'datosChat', datos: datosChat }));
                }

                // Manejar otros tipos de mensajes si es necesario

            } catch (error) {
                console.error('Error al procesar el mensaje en wssCartas:', error);
                ws.send(JSON.stringify({ tipo: 'error', mensaje: 'Error al procesar la solicitud' }));
            }
        });

        ws.on('close', () => {
            console.log('Cliente desconectado del servidor de Cartas Mensajes');
        });

        ws.on('error', (error) => {
            console.error('Error en conexión de Cartas Mensajes:', error);
        });
    }
}

module.exports = new CartasMensajesController();