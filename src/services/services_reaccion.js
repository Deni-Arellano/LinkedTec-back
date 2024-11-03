// services/services_reaccion.js
const Publicacion = require('../models/publicaciones'); // Importa el modelo de Publicación

// Servicio para actualizar o cancelar una reacción en una publicación
const actualizarReaccion = async (id_publicacion, tipo_reaccion, cancelar) => {
    try {
        // Verifica que la publicación exista
        const publicacion = await Publicacion.findByPk(id_publicacion);
        if (!publicacion) {
            throw new Error("Publicación no encontrada");
        }

        // Lógica para cancelar la reacción
        if (cancelar) {
            if (tipo_reaccion === 'me_gusta' && publicacion.me_gusta > 0) {
                publicacion.me_gusta -= 1; // Reduce el contador de "me gusta"
            } else if (tipo_reaccion === 'disgusta' && publicacion.disgusta > 0) {
                publicacion.disgusta -= 1; // Reduce el contador de "disgusta"
            }
        } else {
            // Lógica para agregar la reacción
            if (tipo_reaccion === 'me_gusta') {
                publicacion.me_gusta += 1; // Incrementa el contador de "me gusta"
            } else if (tipo_reaccion === 'disgusta') {
                publicacion.disgusta += 1; // Incrementa el contador de "disgusta"
            }
        }

        // Guarda los cambios en la base de datos
        await publicacion.save();

        return publicacion; // Devuelve la publicación actualizada
    } catch (error) {
        console.error("Error al actualizar la reacción:", error);
        throw error; // Lanza el error para que lo capture el controlador
    }
};

module.exports = {
    actualizarReaccion
};
