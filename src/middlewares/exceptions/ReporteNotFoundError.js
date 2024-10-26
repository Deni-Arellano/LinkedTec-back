class ReporteNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "ReporteNotFoundError";
        this.statusCode = 404;
    }
}

module.exports = ReporteNotFoundError;
