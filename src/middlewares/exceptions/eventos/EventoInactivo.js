class EventoInactivo extends Error {
    constructor(message = 'El evento está inactivo') {
        super(message);
        this.name = 'EventoInactivo';
        this.statusCode = 410;
    }
}


module.exports = EventoInactivo;