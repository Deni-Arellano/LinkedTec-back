class NewsNotFoundError extends Error {
    constructor(message = 'Noticia no encontrada') {
        super(message);
        this.name = 'NewsNotFoundError';
        this.statusCode = 404;
    }
}

module.exports = NewsNotFoundError;