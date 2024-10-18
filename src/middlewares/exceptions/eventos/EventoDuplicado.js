class EventoDuplicado extends Error {
    constructor(message = 'El evento ya existe') {
        super(message);
        this.name = 'EventoDuplicado';
        this.statusCode = 409;
    }
}


module.exports = EventoDuplicado;