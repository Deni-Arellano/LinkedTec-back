// services/reacciones_service.js
const Publicacion = require('../models/publicaciones');

// Servicio para actualizar la reacción de una publicación
const actualizarReaccion = async (id_publicacion, tipoReaccion) => {
    const publicacion = await Publicacion.findByPk(id_publicacion);

    if (!publicacion) {
        throw new Error('Publicación no encontrada');
    }

    // Actualiza el conteo de reacciones
    if (tipoReaccion === 'me_gusta') {
        publicacion.me_gusta += 1;
    } else if (tipoReaccion === 'disgusta') {
        publicacion.disgusta += 1;
    } else {
        throw new Error('Tipo de reacción no válido');
    }

    // Guarda los cambios en la base de datos
    await publicacion.save();
    return publicacion;
};

module.exports = {
    actualizarReaccion
};
