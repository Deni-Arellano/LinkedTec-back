class CreateConflictError extends Error {
    constructor(message = 'Error al crear el recurso') {
        super(message);
        this.name = 'CreateConflictError';
        this.statusCode = 409; 
    }
}

module.exports = CreateConflictError;