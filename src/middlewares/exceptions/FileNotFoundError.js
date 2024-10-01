class FileNotFoundError extends Error {
    constructor(message = 'Error al encontrar el archivo') {
        super(message);
        this.name = 'FileNotFoundError';
        this.statusCode = 409; 
    }
}

module.exports = FileNotFoundError;