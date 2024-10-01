const CustomError = require('./CustomError');

class InvalidExtensionError extends CustomError {
  constructor(fileName, allowedExtensions) {
    super(`La extensión del archivo "${fileName}" no es válida. Las extensiones permitidas son: ${allowedExtensions.join(', ')}.`, 400);
    this.name = 'InvalidExtensionError';
    this.allowedExtensions = allowedExtensions;
  }
}

module.exports = InvalidExtensionError;
