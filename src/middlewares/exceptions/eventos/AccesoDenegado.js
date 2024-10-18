class AccesoDenegado extends Error {
    constructor(message = 'Acceso denegado al evento') {
        super(message);
        this.name = 'AccesoDenegado';
        this.statusCode = 403;
    }
}


module.exports = AccesoDenegado;