class PublicationExistsError extends Error {
    constructor(message = 'La publicacion ya existe o esta en uso') {
        super(message);
        this.name = 'PublicationExistsError';
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = PublicationExistsError;