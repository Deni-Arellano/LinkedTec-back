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




/**
 * @async
 * Servicio para obtener todos los reportes.
 * @returns {Promise<Array>} Devuelve un array con los reportes.
 */
const obtenerReportes= async () => {
    try {
        const reportes = await Reporte.findAll();
        return reportes;
    } catch (error) {
        throw new Error('Error al obtener los reportes: ' + error.message);
    }
};


/**
 * @async
 * Servicio para obtener un reporte por ID.
 * @param {number} id - El ID del reporte.
 * @returns {Promise<Object>} Devuelve el reporte o un error.
 */
const obtenerReportePorId = async (id) => {
    try {
        const reporte = await Reporte.findByPk(id);
        return reporte;
    } catch (error) {
        throw new Error('Error al obtener el reporte: ' + error.message);
    }
}




module.exports = {
    crearReporte,
    obtenerReportes,
    obtenerReportePorId
};
















module.exports = {
    crearReporte
};
