class DeleteConflictError extends Error {

    constructor(message = 'Error al eliminar el recurso') {
        super(message);
        this.name = 'DeleteConflictError';
        this.statusCode = 409; 

    }
}

module.exports = DeleteConflictError;