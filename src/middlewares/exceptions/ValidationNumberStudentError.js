class ValidationNumberStudentError extends Error {
    constructor(message='El número de control no debe de repetirse.') {
        super(message);
        this.name = "ValidationNumberStudentError";
        this.statusCode = 400;
    }
}

module.exports = ValidationNumberStudentError;