const Reporte = require('../models/reportes'); 
const Usuario = require('../models/usuarios');
const { validarRegistroReportes } = require('../middlewares/validations/validaciones_reportes');
const { createReporteService } = require('../services/services_reportes');
const { obtenerDetallesReporte } = require('../services/services_reportes'); 
const {validarReporteExistente,validarReportesExistentes } = require('../middlewares/validations/validaciones_reportes');
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

        const nuevoReporte = await createReporteService(req.body);

        res.status(201).json(nuevoReporte); 
    } catch (error) {
        console.error('Error al crear el reporte:', error);
        // Manejo de errores personalizados
        if (error.message === 'El ID del usuario es requerido.') {
            return res.status(400).json({ error: error.message });
        } else if (error.message === 'El usuario no existe.') {
            return res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error al crear el reporte: ' + error.message });
        }
};
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
        const existenReportes = await validarReportesExistentes();
        if (!existenReportes) {
            return res.status(404).json({ message: 'No hay reportes en la base de datos.' });
        }

        const pagina = parseInt(req.query.pagina) || 1;
        const limite = parseInt(req.query.limite) || 10;

        if (pagina <= 0 || limite <= 0) {
            return res.status(400).json({ message: 'Los parámetros de paginación deben ser números positivos.' });
        }

        const filtros = {
            estado: req.query.estado,
            tipo_reporte: req.query.tipo_reporte,
            categoria_reporte: req.query.categoria_reporte,
            fecha_inicio: req.query.fecha_inicio,
            fecha_fin: req.query.fecha_fin,
            busqueda: req.query.busqueda
        };

        const resultado = await obtenerReportesPaginados(pagina, limite, filtros);

        if (resultado.total === 0) {
            return res.status(404).json({ message: 'No hay reportes que coincidan con los criterios.' });
        }

        if (pagina > resultado.total_paginas) {
            return res.status(404).json({ message: 'No se encontraron reportes en esta página.' });
        }

        res.json({
            total: resultado.total,
            pagina: resultado.pagina,
            limite: resultado.limite,
            total_paginas: resultado.total_paginas,
            pagina_siguiente: resultado.pagina_siguiente
                ? `http://localhost:3000/reportes?pagina=${resultado.pagina_siguiente}&limite=${limite}`
                : null,
            pagina_anterior: resultado.pagina_anterior
                ? `http://localhost:3000/reportes?pagina=${resultado.pagina_anterior}&limite=${limite}`
                : null,
            reportes: resultado.reportes,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los reportes', error: error.message });
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
        await validarReporteExistente(id);
        const reporte = await obtenerReportePorId(id);

        res.json(reporte);
    } catch (error) {
        if (error.name === 'ReporteNotFoundError') {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Error al obtener el reporte', error: error.message });
    }
};




const aprobarReporte = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'El ID debe ser un número válido.' });
        }

        const { reporte, contenidoReportado } = await obtenerDetallesReporte(id);

        if (!reporte) {
            return res.status(404).json({ message: 'El reporte no existe.' });
        }

        reporte.estado = 'Atendido';
        await reporte.save();


        if (contenidoReportado) {
            await contenidoReportado.destroy();
        }

        res.json({ message: 'Reporte aprobado y contenido reportado eliminado con éxito', reporte });
    } catch (error) {
        res.status(400).json({ message: 'Error al procesar el reporte', error: error.message });
    }
};

const ponerEnEsperaReporte = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'El ID debe ser un número válido.' });
        }

        const reporte = await obtenerReportePorId(id);

        if (!reporte) {
            return res.status(404).json({ message: 'El reporte no existe.' });
        }

        reporte.estado = 'En espera';
        await reporte.save();

        res.json({ message: 'Reporte puesto en espera con éxito', reporte });
    } catch (error) {
        res.status(400).json({ message: 'Error al procesar el reporte', error: error.message });
    }
};



const getDetallesReporte = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'El ID debe ser un número válido.' });
        }

        const { reporte, contenidoReportado, usuarioReportado } = await obtenerDetallesReporte(id);

        res.json({
            titulo: reporte.titulo_reporte,
            descripcion: reporte.descripcion,
            categoria: reporte.categoria_reporte,
            tipo: reporte.tipo_reporte,
            usuario: reporte.usuario,
            usuarioReportado,
            contenidoReportado: {
                id: contenidoReportado.id,
                id_publicacion: contenidoReportado.id_publicacion,
                id_evento: contenidoReportado.id_evento,
                id_empleo: contenidoReportado.id_empleo,
                titulo: contenidoReportado.titulo,
                id_noticia: contenidoReportado.id_noticia,
                titulo_noticia: contenidoReportado.titulo_noticia,
                empresa: contenidoReportado.empresa,
                lugar: contenidoReportado.lugar,
                salario: contenidoReportado.salario,
                ubicacion: contenidoReportado.ubicacion,
                descripcion: contenidoReportado.descripcion,
                enlace_noticia: contenidoReportado.enlace_noticia,
                enlace: contenidoReportado.enlace,
                imagen: contenidoReportado.imagen,
                imagen_noticia: contenidoReportado.imagen_noticia,
                categoria_noticia: contenidoReportado.categoria_noticia,
                fecha: contenidoReportado.fecha,
                tipo_evento: contenidoReportado.tipo_evento,
                me_gusta: contenidoReportado.me_gusta,
                disgusta: contenidoReportado.disgusta
            }
        });
    } catch (error) {
        res.status(400).json({ message: 'Error al obtener los detalles del reporte', error: error.message });
    }
};




module.exports = { createReporte, getReportes, getReportePorId, aprobarReporte, ponerEnEsperaReporte, getDetallesReporte };