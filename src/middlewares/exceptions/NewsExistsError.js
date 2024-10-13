class NewsExistsError extends Error {
    constructor(message = 'La noticia ya existe') {
        super(message);
        this.name = 'NewsExistsError';
        this.statusCode = 409;
    }
}

module.exports = NewsExistsError;