class UserExistsError extends Error {

    constructor(message = 'EL usuario ya existe o esta en uso') {
        super(message);
        this.name = 'UserExistsError';
        this.statusCode = 409; 

    }
}

module.exports = UserExistsError;