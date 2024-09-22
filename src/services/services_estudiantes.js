const Estudiante = require('../models/estudiantes');
const Usuario = require('../models/usuarios');

// Función para crear un nuevo estudiante
const createEstudiante = async (usuarioData, estudianteData) => {
    try {
        // Crear el nuevo usuario
        const nuevoUsuario = await Usuario.create(usuarioData);

        // Crear el nuevo estudiante usando el id del nuevo usuario
        const nuevoEstudiante = await Estudiante.create({
            no_control: estudianteData.no_control,
            carrera: estudianteData.carrera,
            semestre: estudianteData.semestre,
            id: nuevoUsuario.id // Asociar el id del usuario creado
        });

        return nuevoEstudiante;
    } catch (error) {
        throw error; // Lanzar el error para manejarlo en el controlador
    }
};

// Función para obtener todos los estudiantes
const getAllEstudiantes = async () => {
    try {
        const estudiantes = await Estudiante.findAll({
            include: [Usuario] // Incluye los datos del usuario asociado
        });
        return estudiantes;
    } catch (error) {
        throw error; // Lanzar el error para manejarlo en el controlador
    }
};

// Función para obtener un estudiante por ID
const getEstudianteById = async (id) => {
    try {
        const estudiante = await Estudiante.findOne({
            where: { id: id }, // Usar el ID del estudiante
            include: [Usuario] // Incluye los datos del usuario asociado
        });

        return estudiante;
    } catch (error) {
        throw error; // Lanzar el error para manejarlo en el controlador
    }
};


module.exports = {
    createEstudiante,
    getAllEstudiantes,
    getEstudianteById
};
