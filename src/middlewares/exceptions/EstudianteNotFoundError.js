class EstudianteNotFoundError extends Error {
    constructor(message = "Estudiante no encontrado") {
        super(message);
        this.name = "EstudianteNotFoundError";
        this.statusCode = 404;
    }
}

module.exports = EstudianteNotFoundError;