// controllers/reacciones_controller.js
const { actualizarReaccion } = require('../services/services_reaccion');

// Controlador para manejar la reacción a una publicación
const reaccionar = async (req, res) => {
    const { id_publicacion, tipoReaccion } = req.body;
    const wss = req.app.get('wss');  // Obtiene la instancia del WebSocket Server

    try {
        const publicacionActualizada = await actualizarReaccion(id_publicacion, tipoReaccion);

        // Emite la actualización de la reacción a todos los clientes conectados
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    id_publicacion: publicacionActualizada.id_publicacion,
                    me_gusta: publicacionActualizada.me_gusta,
                    disgusta: publicacionActualizada.disgusta
                }));
            }
        });

        res.status(200).json({
            message: 'Reacción actualizada correctamente',
            publicacion: publicacionActualizada
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    reaccionar
};
