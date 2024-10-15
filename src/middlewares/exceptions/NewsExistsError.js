class NewsExistsError extends Error {
    constructor(message = 'La noticia ya existe con el mismo titulo o enlace') {
        super(message);
        this.name = 'NewsExistsError';
        this.statusCode = 409;
    }
}

module.exports = NewsExistsError;