class CommentExistsError extends Error {

    constructor(message = 'El comentario ya existe o esta en uso') {
        super(message);
        this.name = 'CommentExistsError';
        this.statusCode = 409; 

    }
}

module.exports = CommentExistsError;