class CommentNotFoundError extends Error {
    constructor(message = 'Comentario no encontrado') {
        super(message);
        this.name = 'CommentNotFoundError';
        this.statusCode = 404;
    }
}

module.exports = CommentNotFoundError;