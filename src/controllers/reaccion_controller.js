const { actualizarReaccion } = require('../services/services_reaccion');
const Publicacion = require('../models/publicaciones'); // Asegúrate de importar el modelo de Publicación

const reaccionar = async (req, res, wssReacciones) => {
    try {
        const { id_publicacion, tipo_reaccion, cancelar } = req.body;

        if (tipo_reaccion !== 'me_gusta' && tipo_reaccion !== 'disgusta') {
            return res.status(400).json({ error: "Tipo de reacción no válido" });
        }

        const publicacion = await Publicacion.findByPk(id_publicacion);
        if (!publicacion) {
            return res.status(404).json({ error: "Publicación no encontrada" });
        }

        const esCancelacion = cancelar === 'cancelar';

        const resultado = await actualizarReaccion(id_publicacion, tipo_reaccion, esCancelacion, wssReacciones);

        return res.status(200).json({ message: "Reacción procesada correctamente", publicacion: resultado });
    } catch (error) {
        console.error("Error al procesar la reacción:", error);
        return res.status(500).json({ error: error.message }); 
    }
};

module.exports = {
    reaccionar
};
