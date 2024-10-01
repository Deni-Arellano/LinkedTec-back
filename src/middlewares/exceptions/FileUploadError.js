class FileUploadError extends Error {
    constructor(message = 'Hubo un error al subir el archivo') {
        super(message);
        this.name = 'FileUploadError';
        this.statusCode = 400; // Bad Request HTTP status code
    }
}

module.exports = FileUploadError;