class EmailExistsError extends Error {
    constructor(message = 'Error al crear egresado y usuario') {
        super(message);
        this.name = 'EmailExistsError';
        this.statusCode = 409; 
    }
}

module.exports = EmailExistsError;