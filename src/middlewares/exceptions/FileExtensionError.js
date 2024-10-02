class FileExtensionError extends Error {
    constructor(message = "La extensión del archivo no es válida.") {
        super(message);
        this.name = "FileExtensionError";
        this.statusCode = 400; 
    }
}

module.exports = FileExtensionError;