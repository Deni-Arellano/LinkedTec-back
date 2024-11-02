class ReporteNotFoundError extends Error {
    constructor(message = "Reporte no encontrado.") {
        super(message);
        this.name = "ReporteNotFoundError";
        this.statusCode = 404;
    }
}

module.exports = ReporteNotFoundError;
