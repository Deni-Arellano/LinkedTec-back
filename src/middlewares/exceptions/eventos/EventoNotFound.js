class EventoNotFound extends Error {
    constructor(message = 'Evento no encontrado') {
        super(message);
        this.name = 'EventoNotFound';
        this.statusCode = 404;
    }
}



module.exports = EventoNotFound;