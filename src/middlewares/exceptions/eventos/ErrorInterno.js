class ErrorInterno extends Error {
    constructor(message = 'Error interno del servidor') {
        super(message);
        this.name = 'ErrorInterno';
        this.statusCode = 500;
    }
}


module.exports = ErrorInterno;