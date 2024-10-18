const Reporte = require('../models/reportes');

const crearReporte = async ({ id_usuario, tipo_reporte, categoria_reporte, descripcion, id_elemento_reportado, titulo_reporte }) => {
    try {
        // Crear un nuevo reporte
        const nuevoReporte = await Reporte.create({
            id_usuario,
            tipo_reporte,
            categoria_reporte,
            descripcion,
            id_elemento_reportado,
            titulo_reporte,
            fecha_reporte: new Date() // Fecha de creación automática
        });

        return nuevoReporte;
    } catch (error) {
        throw new Error('Error al crear el reporte: ' + error.message);
    }
};

module.exports = {
    crearReporte
};
