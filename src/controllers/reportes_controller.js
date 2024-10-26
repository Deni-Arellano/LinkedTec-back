const Reporte = require('../models/reportes'); 
const Usuario = require('../models/usuarios');
const { validarRegistroReportes } = require('../middlewares/validations/validaciones_reportes');
const {obtenerReportesPaginados,obtenerReportePorId} = require('../services/services_reportes')

/**
 * @function createReporte
 * @description Crea un nuevo reporte asociado a un usuario específico.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.body - El cuerpo de la solicitud que contiene los datos del reporte.
 * @param {number} req.body.id_usuario - El ID del usuario que está creando el reporte.
 * @param {string} req.body.tipo_reporte - El tipo de reporte (ej. "infracción", "sugerencia").
 * @param {string} req.body.categoria_reporte - La categoría del reporte (ej. "comportamiento", "incidencia").
 * @param {string} req.body.descripcion - La descripción del reporte.
 * @param {number} req.body.id_elemento_reportado - El ID del elemento que está siendo reportado.
 * @param {string} req.body.titulo_reporte - El título del reporte.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Devuelve el nuevo reporte creado en caso de éxito; de lo contrario, devuelve un error.
 */

const createReporte = async (req, res) => {
    try {
        const { error } = await validarRegistroReportes(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { id_usuario, tipo_reporte, categoria_reporte,fecha, descripcion, id_elemento_reportado, titulo_reporte } = req.body;

        if (!id_usuario) {
            return res.status(400).json({ error: 'El ID del usuario es requerido.' });
        }

        const usuario = await Usuario.findByPk(id_usuario);
        if (!usuario) {
            return res.status(404).json({ error: 'El usuario no existe.' });
        }

        const nuevoReporte = await Reporte.create({
            id_usuario,
            tipo_reporte,
            categoria_reporte,
            descripcion,
            fecha,
            id_elemento_reportado,
            titulo_reporte
        });

        res.status(201).json(nuevoReporte);
    } catch (error) {
        console.error('Error al crear el reporte:', error);
        res.status(500).json({ error: 'Error al crear el reporte: ' + error.message });
    }
};


/**
 * @async
 * Controlador para obtener todos los reportes con paginación.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con los reportes paginados o un error.
 */
const getReportes = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = parseInt(req.query.limite) || 10;
        if (pagina <= 0 || limite <= 0) {
            return res.status(400).json({ message: 'Los parámetros de paginación deben ser números positivos.' });
          }

        const resultado = await obtenerReportesPaginados(pagina, limite);

        if (pagina > resultado.total_paginas) {
            return res.status(404).json({ message: 'No se encontraron reportes en esta página.' });
        }

        res.json({
            total: resultado.total,
            pagina: resultado.pagina,
            limite: resultado.limite,
            total_paginas: resultado.total_paginas,
            pagina_siguiente: resultado.pagina_siguiente ? `http://localhost:3000/reportes?pagina=${resultado.pagina_siguiente}&limite=${limite}` : null,
            pagina_anterior: resultado.pagina_anterior ? `http://localhost:3000/reportes?pagina=${resultado.pagina_anterior}&limite=${limite}` : null,
            reportes: resultado.reportes
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los reportes', error: error.message });
    }
};





/**
 * @async
 * Controlador para obtener un reporte por ID.
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @returns {Promise<void>} Devuelve una respuesta JSON con el reporte o un error.
 */
const getReportePorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'El ID debe ser un número válido.' });
        }

        const reporte = await obtenerReportePorId(id);

        if (!reporte) {
            return res.status(404).json({ message: 'Reporte no encontrado.' });
        }

        res.json(reporte);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener el reporte', error: error.message });
    }
};



module.exports = { createReporte, getReportes, getReportePorId };
