const Reporte = require('../models/reportes'); 
const Usuario = require('../models/usuarios');
const { validarRegistroReportes } = require('../middlewares/validations/validaciones_reportes');


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

        const { id_usuario, tipo_reporte, categoria_reporte, descripcion, id_elemento_reportado, titulo_reporte } = req.body;

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
 * Servicio para obtener todos los reportes con paginación.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con los reportes paginados o un error.
 */
const getReportes = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = parseInt(req.query.limite) || 10;
        const offset = (pagina - 1) * limite;

        const resultado = await Reporte.findAndCountAll({
            limit: limite,
            offset: offset
        });

        if (!resultado.rows.length) {
            return res.status(404).json({ message: 'No se encontraron reportes.' });
        }

        const totalReportes = resultado.count;
        const totalPaginas = Math.ceil(totalReportes / limite);

        return res.json({
            total: totalReportes,
            pagina: pagina,
            limite: limite,
            total_paginas: totalPaginas,
            pagina_siguiente: {
                url: pagina < totalPaginas ? `http://localhost:3000/reportes?pagina=${pagina + 1}&limite=${limite}` : null,
                exists: pagina < totalPaginas
            },
            pagina_anterior: {
                url: pagina > 1 ? `http://localhost:3000/reportes?pagina=${pagina - 1}&limite=${limite}` : null,
                exists: pagina > 1
            },
            reportes: resultado.rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener los reportes: ' + error.message });
    }
};


/**
 * @async
 * Servicio para obtener un reporte por ID.
 * @param {number} id - El ID del reporte.
 * @returns {Promise<Object>} Devuelve el reporte o un error.
 */

const getReporteById = async (req, res) => {
    try {
        const { id } = req.params;
        const reporte = await Reporte.findByPk(id);
        if (!reporte) {
            return res.status(404).json({ error: 'Reporte no encontrado.' });
        }
        res.json(reporte);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el reporte: ' + error.message });
    }
};



module.exports = { createReporte, getReportes, getReporteById };
