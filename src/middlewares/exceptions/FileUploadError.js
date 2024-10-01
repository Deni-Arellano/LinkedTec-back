class FileUploadError extends Error {
    constructor(message = 'Error al subir el archivo') {
        super(message);
        this.name = 'FileUploadError';
        this.statusCode = 400; 
    }
}

module.exports = FileUploadError;