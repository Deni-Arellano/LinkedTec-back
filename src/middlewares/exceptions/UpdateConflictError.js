class UpdateConflictError extends Error {
    constructor(message = 'Hubo un error de actualización') {
        super(message);
        this.name = 'UpdateConflictError';
        this.statusCode = 409; // Conflict HTTP status code
    }
}

module.exports = UpdateConflictError;