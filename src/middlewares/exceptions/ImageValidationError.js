class ImageValidationError extends Error {
    constructor(message = 'Hubo un error de validación de imagen') {
        super(message);
        this.name = 'ImageValidationError';
        this.statusCode = 400; 
    }
}

module.exports = ImageValidationError;