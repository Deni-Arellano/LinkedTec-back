class DatabaseConnectionErrors extends CustomError {
    statusCode = 500;
  
    constructor(mensaje) {
      super(mensaje || 'Error en la conexión a la base de datos');
    }
  
    serializeErrors() {
      return [{ message: this.message }];
    }
  }
  