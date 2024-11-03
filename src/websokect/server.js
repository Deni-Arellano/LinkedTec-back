const WebSocket = require('ws');
const { actualizarReaccion } = require('./services/services_reaccion'); // Asegúrate de importar tu servicio

const wss = new WebSocket.Server({ port: 8080 }); // Cambia el puerto según tu configuración

wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        const data = JSON.parse(message);

        if (data.accion === 'reaccionar') {
            const { id_publicacion, tipo_reaccion, cancelar } = data;

            // Verifica si el tipo de reacción es válido
            if (tipo_reaccion !== 'me_gusta' && tipo_reaccion !== 'disgusta') {
                ws.send(JSON.stringify({ error: "Tipo de reacción no válido" }));
                return;
            }

            try {
                const esCancelacion = cancelar === 'cancelar';
                const publicacionActualizada = await actualizarReaccion(id_publicacion, tipo_reaccion, esCancelacion);

                // Envía una respuesta al cliente
                ws.send(JSON.stringify({ message: "Reacción procesada correctamente", publicacion: publicacionActualizada }));
            } catch (error) {
                console.error("Error al procesar la reacción:", error);
                ws.send(JSON.stringify({ error: "Error en el servidor" }));
            }
        }
    });
});

console.log('Servidor WebSocket escuchando en ws://localhost:8080');
