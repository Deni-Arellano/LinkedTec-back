const Reporte = require('../models/reportes');
const db = require('../config/database');


const crearReporte = async ({ id_usuario, tipo_reporte, categoria_reporte, descripcion, id_elemento_reportado, titulo_reporte }) => {
    try {
        const nuevoReporte = await Reporte.create({
            id_usuario,
            tipo_reporte,
            categoria_reporte,
            descripcion,
            id_elemento_reportado,
            titulo_reporte,
            fecha_reporte: new Date() 
        });

        return nuevoReporte;
    } catch (error) {
        throw new Error('Error al crear el reporte: ' + error.message);
    }
};




/**
 * @async
 * Servicio para obtener todos los reportes con paginación usando SQL.
 * @param {number} pagina - Número de página.
 * @param {number} limite - Cantidad de reportes por página.
 * @returns {Promise<Object>} Devuelve un objeto con los reportes paginados.
 */
const obtenerReportesPaginados = async (pagina = 1, limite = 10) => {
    const offset = (pagina - 1) * limite;
    try {
        const [[{ total }]] = await db.query(`
            SELECT COUNT(*) AS total 
            FROM reportes
        `);

        const [reportes] = await db.query(`
            SELECT * FROM reportes
            ORDER BY fecha_reporte DESC
            LIMIT ${limite} OFFSET ${offset}
        `);

        const totalPaginas = Math.ceil(total / limite);

        return {
            total,
            pagina,
            limite,
            total_paginas: totalPaginas,
            pagina_siguiente: pagina < totalPaginas ? pagina + 1 : null,
            pagina_anterior: pagina > 1 ? pagina - 1 : null,
            reportes
        };
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
};





module.exports = {
    crearReporte,
    obtenerReportesPaginados,
    obtenerReportePorId
};

