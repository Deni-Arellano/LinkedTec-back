class EmailExistsError extends Error {
    constructor(message = 'El email ya existe o está en uso') {
        super(message);
        this.name = 'EmailExistsError';
        this.statusCode = 409; 
    }
}

module.exports = EmailExistsError;