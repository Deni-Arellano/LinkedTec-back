class CreateConflictError extends Error {
    constructor(message = 'Hubo un error de creación') {
        super(message);
        this.name = 'CreateConflictError';
        this.statusCode = 409; 
    }
}

module.exports = CreateConflictError;