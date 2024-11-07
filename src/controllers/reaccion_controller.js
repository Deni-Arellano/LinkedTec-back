const { actualizarReaccion } = require('../services/services_reaccion');
const Publicacion = require('../models/publicaciones'); // Asegúrate de importar el modelo de Publicación

const reaccionar = async (req, res, wssReacciones) => {
    try {
        const { id_publicacion, tipo_reaccion, cancelar, id_usuario } = req.body; // Agregar id_usuario

        // Validar el tipo de reacción
        if (tipo_reaccion !== 'me_gusta' && tipo_reaccion !== 'disgusta') {
            return res.status(400).json({ error: "Tipo de reacción no válido" });
        }

        // Validar si la publicación existe
        const publicacion = await Publicacion.findByPk(id_publicacion);
        if (!publicacion) {
            return res.status(404).json({ error: "Publicación no encontrada" });
        }

        // Determinar si es una cancelación
        const esCancelacion = cancelar === 'cancelar';

        // Llamar al servicio y pasar el id_usuario
        const resultado = await actualizarReaccion(id_publicacion, tipo_reaccion, esCancelacion, wssReacciones, id_usuario);

        return res.status(200).json({ message: "Reacción procesada correctamente", publicacion: resultado });
    } catch (error) {
        return res.status(400).json({ error: error.message }); 
    }
};

module.exports = {
    reaccionar
};
