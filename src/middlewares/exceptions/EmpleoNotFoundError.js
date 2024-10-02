class EmpleoNotFoundError extends Error {
    constructor(message = 'Empleo no encontrado.') {
      super(message);
      this.name = 'EmpleoNotFoundError';
      this.statusCode = 404; // Not Found
    }
  }
  
  module.exports = EmpleoNotFoundError;
  