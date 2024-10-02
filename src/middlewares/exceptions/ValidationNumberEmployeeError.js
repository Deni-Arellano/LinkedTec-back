class ValidationNumberEmployeeError extends Error {
    constructor(message='El número de empleado no debe de repetirse.') {
        super(message);
        this.name = "ValidationNumberEmployeeError";
        this.statusCode = 400;
    }
}

module.exports = ValidationNumberEmployeeError;