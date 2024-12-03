const util_estadisticas = require('../util/util_estadisticas');
const sequelize = require('../config/database');
const reportes = require('../models/reportes');
const {Op, INTEGER} = require('sequelize');
const moment = require('moment');
const {Sequelize} = require('sequelize');

const services_usuarios = require('./services_usuarios');
const services_noticias = require('./services_noticias');
const services_publicaciones = require('./services_publicaciones');
const services_empleos = require('./services_empleos');

const SubirArchivosCloudinary = require('../util/SubirArchivosCloudinary');
exports.obtenerCantidadReportesPorMes = async () => {
    try {
        // Obtener el año actual
        const anioActual = new Date().getFullYear();

        // Consulta SQL para obtener la cantidad de reportes por mes del año actual
        const [results] = await sequelize.query(`
            SELECT MONTH(fecha_reporte) AS mes,
                   COUNT(*)             AS cantidad
            FROM reportes
            WHERE YEAR(fecha_reporte) = :anioActual
            GROUP BY MONTH(fecha_reporte)
            ORDER BY mes;
        `, {
            replacements: {anioActual}, // Reemplazar parámetro
        });

        // Transformar los datos para incluir el nombre del mes en español
        const datosPorMes = results.map(row => ({
            mes: util_estadisticas.mapeoDeMeses(row.mes), // Convertir número a nombre del mes
            cantidad: row.cantidad, // Mantener clave en español
        }));

        return datosPorMes; // Solo meses con sus valores
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener la cantidad de reportes por mes');
    }
};


exports.obtenerTotalReportes = async () => {
    try {
        const totalReportes = await reportes.count();

        return totalReportes;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener el total de reportes');
    }
}


exports.obteenerTotalreportesSinAtender = async () => {

    try {
        const totalReportesSinAtender = await reportes.count({
            where: {
                estado: 'Pendiente'
            }
        });

        return totalReportesSinAtender;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener el total de reportes sin atender');
    }
}


exports.obtenerCantidadReportesAtendidos = async () => {

    try {
        const totalReportesAtendidos = await reportes.count({
            where: {
                estado: 'Atendido'
            }
        });

        return totalReportesAtendidos;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener el total de reportes atendidos');
    }
}

exports.obtenerReportesEnEspera = async () => {
    try {
        const reportesEnEspera = await reportes.count({
            where: {
                estado: 'En espera'
            }
        });

        return reportesEnEspera;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener los reportes en espera');
    }
};


exports.obtenerPromedioReportesDiarios = async () => {
    try {
        // Contar el total de reportes
        const totalReportes = await reportes.count();

        // Obtener la cantidad de días únicos en los que se han reportado
        const diasUnicos = await reportes.findAll({
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('fecha_reporte')), 'dia_unico']
            ],
            group: ['dia_unico'],
        });

        // Verificar si diasUnicos tiene resultados
        const diasUnicosArray = diasUnicos || [];

        // Calcular el promedio de reportes diarios
        const promedioDiario = diasUnicosArray.length > 0 ? totalReportes / diasUnicosArray.length : 0;

        return Math.round(promedioDiario);
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener el promedio de reportes diarios');
    }
};


exports.obtenerCantidadReportesPorTipo = async () => {
    try {
        const reportesPorTipo = await reportes.findAll({
            attributes: [
                'tipo_reporte',
                [sequelize.fn('COUNT', sequelize.col('tipo_reporte')), 'count']
            ],
            group: ['tipo_reporte'],
            raw: true, // Para obtener los datos como un objeto plano
        });

        return reportesPorTipo;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener la cantidad de reportes por tipo');
    }
};

exports.obtenerEstadisticas = async () => {
    try {

        const Cloudinary = new SubirArchivosCloudinary();

        const totalReportes = await this.obtenerTotalReportes();
        const totalReportesSinAtender = await this.obteenerTotalreportesSinAtender();
        const totalReportesAtendidos = await this.obtenerCantidadReportesAtendidos();
        const reportesEnEspera = await this.obtenerReportesEnEspera();
        const promedioDiario = await this.obtenerPromedioReportesDiarios();
        const reportesPorTipo = await this.obtenerCantidadReportesPorTipo();
        const reportesPorMes = await this.obtenerCantidadReportesPorMes();

        // Publicaciones
        const totalPublicaciones = await services_publicaciones.obtenerTotalPublicaciones();
        const totalPublicacionesPorMes = await services_publicaciones.obtenerPublicacionesPorMes();
        const promedioPublicacionesDiarias = await services_publicaciones.obtenerPromedioPublicacionesDiarias();

        // Noticias
        const totalNoticias = await services_noticias.ebtenerTotalNoticias();
        const totalNoticiasPorMes = await services_noticias.obtenerTotalNoticiasPorMes();
        const promedioNoticiasDiarias = await services_noticias.obtenerPromedioNoticiasDiarias();

        // Empleos
        const totalEmpleos = await services_empleos.obtenerCantidadEmpleos();
        const totalEmpleosPorMes = await services_empleos.obtenerCantidadEmpleosPorMes();
        const promedioEmpleosDiarios = await services_empleos.obtenerPromedioEmpleosDiarios();

        // Usuarios
        const totalUsuarios = await services_usuarios.obtenerTotalUsuarios();
        const totalUsuariosPorRol = await services_usuarios.obtenerTotalUsuariosPorRol();


        //reportesportipo
        //reportespormes
        //publicacionespormes
        //noticiasPorMes
        //empleosPorMes
        //TotalUsuariosPorRol
        // Combinar los datos en un solo objeto JSON
        return {
            reportes: {

                reportes: {
                    totalReportes,
                    totalReportesSinAtender,
                    totalReportesAtendidos,
                    reportesEnEspera,
                    promedioDiario
                },
                reportesPorTipo,
                reportesPorMes

            },
            valores: {
                reportes: {
                    totalReportes,
                    totalReportesSinAtender,
                    totalReportesAtendidos,
                    reportesEnEspera,
                    promedioDiario
                },
                publicaciones: {
                    totalPublicaciones,
                    promedioPublicacionesDiarias
                },
                noticias: {
                    totalNoticias,
                    promedioNoticiasDiarias
                },
                empleos: {
                    totalEmpleos,
                    promedioEmpleosDiarios
                },
                usuarios: {
                    totalUsuarios,
                },


            },
            datosGraficar: {
                reportes: {
                    reportesPorTipo,
                    reportesPorMes
                },
                publicaciones: {
                    totalPublicacionesPorMes
                },
                noticias: {
                    totalNoticiasPorMes
                },
                empleos: {
                    totalEmpleosPorMes
                },
                usuarios: {
                    totalUsuariosPorRol
                }
            },
            cloudinary: await Cloudinary.obtenerUsoDeCloudinary()

        };
    } catch
        (error) {
        console.error(error);
        throw new Error('Error al obtener las estadísticas');
    }
}
;
