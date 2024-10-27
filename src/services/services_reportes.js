const Reporte = require('../models/reportes');
const Usuario = require('../models/usuarios');

const createReporteService = async (body) => {
    const { id_usuario, tipo_reporte, categoria_reporte, fecha, descripcion, id_elemento_reportado, titulo_reporte } = body;

    if (!id_usuario) {
        throw new Error('El ID del usuario es requerido.');
    }

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
        throw new Error('El usuario no existe.');
    }

    const nuevoReporte = await Reporte.create({
        id_usuario,
        tipo_reporte,
        categoria_reporte,
        descripcion,
        fecha,
        id_elemento_reportado,
        titulo_reporte,
    });

    return nuevoReporte; 
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
    createReporteService,
    obtenerReportes,
    obtenerReportePorId
};
















