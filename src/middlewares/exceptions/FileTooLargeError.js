class FileTooLargeError extends Error {
  constructor(message= 'El tamaño del archivo excede el límite permitido.') {
    super(message);
    this.name = 'FileTooLargeError';
    this.statusCode = 413; // 413 Payload Too Large
  }
}

module.exports = FileTooLargeError;