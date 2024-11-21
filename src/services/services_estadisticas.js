const util_estadisticas = require('../util/util_estadisticas');
const sequelize = require('../config/database');
const reportes = require('../models/reportes');
const { Op } = require('sequelize');
const moment = require('moment');

exports.obtenerCantidadReportesPorMes = async () => {
  try {
    const [results, metadata] = await sequelize.query(`
      SELECT
        YEAR(fecha_reporte) AS year,
        MONTH(fecha_reporte) AS month,
        COUNT(*) AS report_count
      FROM
        reportes
      GROUP BY
        YEAR(fecha_reporte), MONTH(fecha_reporte)
      ORDER BY
        year, month;
    `);

    // Agrupar los resultados por año y transformar el número del mes en nombre
    const groupedResults = results.reduce((acc, row) => {
      const { year, month, report_count } = row;

      if (!acc[year]) {
        acc[year] = [];
      }

      acc[year].push({ month: util_estadisticas.mapeoDeMeses(month), report_count });

      return acc;
    }, {});

    return groupedResults;
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


const { Sequelize } = require('sequelize');

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

        return promedioDiario;
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