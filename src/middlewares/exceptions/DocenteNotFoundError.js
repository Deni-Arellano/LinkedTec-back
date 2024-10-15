class DocenteNotFoundError extends Error {
    constructor(message = 'Docente no encontrado') {
        super(message);
        this.name = 'DocenteNotFoundError';
        this.statusCode = 404;
    }
}

module.exports = DocenteNotFoundError;
