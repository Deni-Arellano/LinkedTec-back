const util_estadisticas = require('../util/util_estadisticas');
const sequelize = require('../config/database');
const reportes = require('../models/reportes');


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
                estado: 'sin-atender'
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
                 estado: 'atendido'
                }
          });

          return totalReportesAtendidos;
     } catch (error) {
          console.error(error);
          throw new Error('Error al obtener el total de reportes atendidos');
     }
}