// controllers/reacciones_controller.js
const { actualizarReaccion } = require('../services/services_reaccion');
const Publicacion = require('../models/publicaciones'); // Asegúrate de importar el modelo de Publicación

// Controlador para manejar la reacción a una publicación
const reaccionar = async (req, res) => {
    try {
        const { id_publicacion, tipo_reaccion, cancelar } = req.body;

        // Verifica si el tipo de reacción es válido
        if (tipo_reaccion !== 'me_gusta' && tipo_reaccion !== 'disgusta') {
            return res.status(400).json({ error: "Tipo de reacción no válido" });
        }

        // Encuentra la publicación correspondiente
        const publicacion = await Publicacion.findByPk(id_publicacion);
        if (!publicacion) {
            return res.status(404).json({ error: "Publicación no encontrada" });
        }

        // Detecta si es una cancelación
        const esCancelacion = cancelar === 'cancelar';

        // Actualiza la reacción usando el servicio
        const resultado = await actualizarReaccion(id_publicacion, tipo_reaccion, esCancelacion);

        return res.status(200).json({ message: "Reacción procesada correctamente", publicacion: resultado });
    } catch (error) {
        console.error("Error al procesar la reacción:", error);
        return res.status(500).json({ error: error.message }); // Devolver el mensaje de error específico
    }
};

module.exports = {
    reaccionar
};
