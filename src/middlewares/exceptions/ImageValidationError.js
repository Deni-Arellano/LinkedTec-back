class ImageValidationError extends Error {
    constructor(message = 'Error de validación de imagen') {
        super(message);
        this.name = 'ImageValidationError';
        this.statusCode = 400; 
    }
}

module.exports = ImageValidationError;