const services_estadisticas = require('../services/services_estadisticas');

exports.obtenerReportes = async (req, res) => {
    const {tipo} = req.query;

    try {
        let result;

        switch (tipo) {
            case 'por-mes':
                result = await services_estadisticas.obtenerCantidadReportesPorMes();
                break;
            case "total-reportes":
                result = await services_estadisticas.obtenerTotalReportes();
                break;
            case 'sin-atender':
                result = await services_estadisticas.obteenerTotalreportesSinAtender();
                break;
            case 'atendidos':
                result = await services_estadisticas.obtenerCantidadReportesAtendidos();
                break;
            case 'en-espera':
                result = await services_estadisticas.obtenerReportesEnEspera();
                break;

            default:
                return res.status(400).json({error: 'Tipo de reporte no válido'});
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};


exports.obtenerPromedioReportesDiarios = async (req, res) => {
    const { dias } = req.query;  // Opcional: recibir días recientes como parámetro de consulta

    try {
        const promedio = await services_estadisticas.obtenerPromedioReportesDiarios(dias || 30);  // Por defecto 30 días
        return res.status(200).json({ promedio_diario: promedio });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


exports.obtenerGraficaReportes = async (req, res) => {
    try {
        const reportesPorTipo = await services_estadisticas.obtenerCantidadReportesPorTipo();

        // Enviar los datos al frontend
        res.json({
            data: reportesPorTipo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los datos para la gráfica' });
    }
};