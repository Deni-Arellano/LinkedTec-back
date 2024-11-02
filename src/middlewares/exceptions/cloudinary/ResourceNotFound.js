class ResourceNotFoundError extends Error {
  constructor(mensaje = 'El /recurso/ no existe o no fue encontrado en Cloudinary', ...params) {
    super(mensaje);
    this.name = 'ResourceNotFoundError';
    this.status = 404;
  }
}

module.exports = ResourceNotFoundError;