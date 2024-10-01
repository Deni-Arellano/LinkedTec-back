class UserNotFoundError extends Error {
    constructor(message = 'No se encontro el usuario') {
        super(message);
        this.name = 'UserNotFoundError';
        this.statusCode = 400; 
    }
}

module.exports = UserNotFoundError;