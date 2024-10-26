class AccessDeniedError extends Error {

    constructor(message = 'El acceso a este recurso fue denegado') {
        super(message);
        this.name = 'AccessDeniedError';
        this.statusCode = 403; 

    }
}

module.exports = AccessDeniedError;