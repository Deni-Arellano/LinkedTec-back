class EmpleoExistsError extends Error {
    constructor(message = 'El empleo ya existe.') {
      super(message);
      this.name = 'EmpleoExistsError';
      this.statusCode = 409; // Conflict
    }
  }
  
  module.exports = EmpleoExistsError;
  