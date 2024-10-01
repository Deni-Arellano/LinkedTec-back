class PublicationNotFoundError extends Error {
    constructor(message = 'La publicacion no existe') {
        super(message);
        this.name = 'PublicationNotFoundError';
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = PublicationNotFoundError;