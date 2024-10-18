class ParametrosInvalidos extends Error {
    constructor(message = 'Parámetros de entrada no válidos') {
        super(message);
        this.name = 'ParametrosInvalidos';
        this.statusCode = 400;
    }
}


module.exports = ParametrosInvalidos;