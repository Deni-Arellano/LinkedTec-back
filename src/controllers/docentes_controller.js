const Docente = require('../models/docentes');
const Usuario = require('../models/usuarios');

// Función para crear un nuevo docente
const createDocente = async (req, res) => {
    try {
        const { usuario, docente } = req.body;

        // Verifica si los datos de 'usuario' y 'docente' existen
        if (!usuario || !docente) {
            return res.status(400).json({ error: "El cuerpo de la solicitud está incompleto." });
        }

        // Crear el nuevo usuario
        const nuevoUsuario = await Usuario.create(usuario, {
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        // Crear el nuevo docente usando el id del nuevo usuario
        const nuevoDocente = await Docente.create({
            ultimo_nivel_estudios: docente.ultimo_nivel_estudios,
            numero_empleado: docente.numero_empleado,
            academia: docente.academia,
            id: nuevoUsuario.id // Asociar el id del usuario creado
        }, {
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        // Retornar tanto el nuevo usuario como el nuevo docente sin createdAt y updatedAt
        res.status(201).json({
            usuario: nuevoUsuario,
            docente: nuevoDocente
        });
    } catch (error) {
        console.error(error); // Imprime el error en la consola
        res.status(500).json({ error: error.errors ? error.errors.map(e => e.message) : error.message });
    }
};

// Función para obtener todos los docentes
const getAllDocentes = async (req, res) => {
    try {
        const docentes = await Docente.findAll({
            include: [{
                model: Usuario,
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            }],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        res.status(200).json(docentes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Función para obtener un docente por ID
const getDocenteById = async (req, res) => {
    try {
        const id = req.params.id;
        const docente = await Docente.findOne({
            where: { id: id }, // Usar el ID del docente
            include: [{
                model: Usuario,
                attributes: { exclude: ['createdAt', 'updatedAt'] }
            }],
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        if (!docente) {
            return res.status(404).json({ error: "Docente no encontrado." });
        }

        res.status(200).json(docente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createDocente,
    getAllDocentes,
    getDocenteById
};
