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
            default:
                return res.status(400).json({error: 'Tipo de reporte no válido'});
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};
