class ServerConnectionError extends Error {
    constructor(message = 'Hubo un error de conexión al servidor') {
        super(message);
        this.name = 'ServerConnectionError';
        this.statusCode = 500;
    }
}

module.exports = ServerConnectionError;