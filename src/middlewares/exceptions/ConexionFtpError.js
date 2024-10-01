class ConexionFtpError extends Error {
    constructor(message = 'Error al encontrar el archivo') {
        super(message);
        this.name = 'ConexionFtpError';
        this.statusCode = 409; 
    }
}

module.exports = ConexionFtpError;