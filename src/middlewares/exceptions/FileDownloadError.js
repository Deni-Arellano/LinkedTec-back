class FileDownloadError extends Error {
    constructor(message = 'Hubo un error al descargar el archivo') {
        super(message);
        this.name = 'FileDownloadError';
        this.statusCode = 500; 
    }
}

module.exports = FileDownloadError;