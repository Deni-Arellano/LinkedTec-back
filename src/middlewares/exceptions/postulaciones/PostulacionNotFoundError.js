
class PostulacionNotFoundError extends Error {


    constructor(message = 'Postulación no encontrada') {
      super(message);
      this.name = 'PostulacionNotFoundError';
      this.statusCode = 404;
    }
  }
  
  module.exports = PostulacionNotFoundError;
  