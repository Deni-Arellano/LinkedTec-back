const { Usuario } = require('../models/usuarios');
const { Docente } = require('../models/docentes');

// Función para crear un nuevo usuario
const createUsuario = async (data) => {
    return await Usuario.create(data);
};

// Función para crear un nuevo docente
const createDocente = async (data) => {
    return await Docente.create(data);
};

// Función para obtener todos los docentes
const getAllDocentes = async () => {
    return await Docente.findAll({
        include: [Usuario] // Incluye los datos del usuario asociado
    });
};

// Función para obtener un docente por ID
const getDocenteById = async (id) => {
    return await Docente.findOne({
        where: { id: id },
        include: [Usuario]
    });
};

module.exports = {
    createUsuario,
    createDocente,
    getAllDocentes,
    getDocenteById
};