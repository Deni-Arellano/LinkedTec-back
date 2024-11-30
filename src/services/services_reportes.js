const Reporte = require('../models/reportes');
const Usuario = require('../models/usuarios');
const Noticia = require('../models/noticias');
const Evento = require('../models/eventos');
const Publicacion = require('../models/publicaciones');
const Empleo = require('../models/empleos');

const sequelize = require('../config/database');

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
 * Servicio para obtener todos los reportes con paginación usando SQL.
 * @param {number} pagina - Número de página.
 * @param {number} limite - Cantidad de reportes por página.
 * @returns {Promise<Object>} Devuelve un objeto con los reportes paginados.
 */
const obtenerReportesPaginados = async (pagina = 1, limite = 10, filtros = {}) => {
    const offset = (pagina - 1) * limite;
    const { estado, tipo_reporte, categoria_reporte, fecha_inicio, fecha_fin, busqueda } = filtros;

    const where = {};
    if (estado) where.estado = estado;
    if (tipo_reporte) where.tipo_reporte = tipo_reporte;
    if (categoria_reporte) where.categoria_reporte = categoria_reporte;
    if (fecha_inicio && fecha_fin) {
        where.fecha_reporte = {
            [Sequelize.Op.between]: [fecha_inicio, fecha_fin]
        };
    }
    if (busqueda) {
        where[Sequelize.Op.or] = [
            { titulo_reporte: { [Sequelize.Op.like]: `%{busqueda}%` } },
            { descripcion: { [Sequelize.Op.like]: `%{busqueda}%` } }
        ];
    }

    try {
        const { count: total, rows: reportes } = await Reporte.findAndCountAll({
            where,
            limit: limite,
            offset,
            order: [['fecha_reporte', 'DESC']]
        });

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


const actualizarEstadoReporte = async (id, estado) => {
    try {
        const reporte = await Reporte.findByPk(id);
        if (!reporte) {
            throw new Error('Reporte no encontrado.');
        }

        reporte.estado = estado;
        await reporte.save();

        return reporte;
    } catch (error) {
        throw new Error('Error al actualizar el reporte: ' + error.message);
    }
};


const obtenerDetallesReporte = async (id) => {
    try {
        const reporte = await Reporte.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'nombre', 'correo']
                }
            ]
        });

        if (!reporte) {
            throw new Error('Reporte no encontrado.');
        }

        let contenidoReportado = null;
        let usuarioReportado = null;

        switch (reporte.categoria_reporte) {
            case 'noticias':
                contenidoReportado = await Noticia.findByPk(reporte.id_elemento_reportado);
                if (contenidoReportado) {
                    usuarioReportado = await Usuario.findByPk(contenidoReportado.id_usuario, {
                        attributes: ['id', 'nombre', 'correo']
                    });
                }
                break;
            case 'eventos':
                contenidoReportado = await Evento.findByPk(reporte.id_elemento_reportado);
                if (contenidoReportado) {
                    usuarioReportado = await Usuario.findByPk(contenidoReportado.id_usuario, {
                        attributes: ['id', 'nombre', 'correo']
                    });
                }
                break;
            case 'publicaciones':
                contenidoReportado = await Publicacion.findByPk(reporte.id_elemento_reportado);
                if (contenidoReportado) {
                    usuarioReportado = await Usuario.findByPk(contenidoReportado.id_usuario, {
                        attributes: ['id', 'nombre', 'correo']
                    });
                }
                break;
            case 'empleos':
                contenidoReportado = await Empleo.findByPk(reporte.id_elemento_reportado);
                if (contenidoReportado) {
                    usuarioReportado = await Usuario.findByPk(contenidoReportado.id_usuario, {
                        attributes: ['id', 'nombre', 'correo']
                    });
                }
                break;
            default:
                contenidoReportado = null;
                usuarioReportado = null;
        }

        return {
            reporte,
            contenidoReportado,
            usuarioReportado
        };
    } catch (error) {
        throw new Error('Error al obtener los detalles del reporte: ' + error.message);
    }
};

module.exports = {
    obtenerReportePorId,
    createReporteService,
    obtenerReportesPaginados,
    actualizarEstadoReporte,
    obtenerDetallesReporte
};
