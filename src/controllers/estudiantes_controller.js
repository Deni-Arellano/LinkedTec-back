const Estudiante = require('../models/estudiantes');
const Usuario = require('../models/usuarios');

// Función para crear un nuevo estudiante
const createEstudiante = async (req, res) => {
    try {
        const { usuario, estudiante } = req.body;

        // Verifica si los datos de 'usuario' y 'estudiante' existen
        if (!usuario || !estudiante) {
            return res.status(400).json({ error: "El cuerpo de la solicitud está incompleto." });
        }

        // Crear el nuevo usuario
        const nuevoUsuario = await Usuario.create(usuario);

        // Crear el nuevo estudiante usando el id del nuevo usuario
        const nuevoEstudiante = await Estudiante.create({
            no_control: estudiante.no_control,
            carrera: estudiante.carrera,
            semestre: estudiante.semestre,
            id: nuevoUsuario.id // Asociar el id del usuario creado
        });

        // Retornar todos los datos, incluyendo el ID del estudiante
        const estudianteCompleto = {
            id: nuevoEstudiante.id, // ID del estudiante
            nombre: nuevoUsuario.nombre,
            apellido_paterno: nuevoUsuario.apellido_paterno,
            apellido_materno: nuevoUsuario.apellido_materno,
            rol: nuevoUsuario.role,
            carrera: nuevoEstudiante.carrera,
            biografia: nuevoUsuario.biografia,
            telefono: nuevoUsuario.telefono,
            correo: nuevoUsuario.correo,
            fecha_nacimiento: nuevoUsuario.fecha_nacimiento,
            sexo: nuevoUsuario.sexo
        };

        res.status(201).json(estudianteCompleto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.errors ? error.errors.map(e => e.message) : error.message });
    }
};

// Función para obtener todos los estudiantes
const getAllEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.findAll({
            include: [Usuario] // Incluye los datos del usuario asociado
        });

        const estudiantesCompletos = estudiantes.map(estudiante => ({
            id: estudiante.id, // ID del estudiante
            nombre: estudiante.Usuario.nombre,
            apellido_paterno: estudiante.Usuario.apellido_paterno,
            apellido_materno: estudiante.Usuario.apellido_materno,
            rol: estudiante.Usuario.role,
            carrera: estudiante.carrera,
            biografia: estudiante.Usuario.biografia,
            telefono: estudiante.Usuario.telefono,
            correo: estudiante.Usuario.correo,
            fecha_nacimiento: estudiante.Usuario.fecha_nacimiento,
            sexo: estudiante.Usuario.sexo
        }));

        res.status(200).json(estudiantesCompletos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Función para obtener un estudiante por ID
const getEstudianteById = async (req, res) => {
    try {
        const id = req.params.id;
        const estudiante = await Estudiante.findOne({
            where: { id: id }, // Usar el ID del estudiante
            include: [Usuario] // Incluye los datos del usuario asociado
        });

        if (!estudiante) {
            return res.status(404).json({ error: "Estudiante no encontrado." });
        }

        const estudianteCompleto = {
            id: estudiante.id, // ID del estudiante
            nombre: estudiante.Usuario.nombre,
            apellido_paterno: estudiante.Usuario.apellido_paterno,
            apellido_materno: estudiante.Usuario.apellido_materno,
            rol: estudiante.Usuario.role,
            carrera: estudiante.carrera,
            biografia: estudiante.Usuario.biografia,
            telefono: estudiante.Usuario.telefono,
            correo: estudiante.Usuario.correo,
            fecha_nacimiento: estudiante.Usuario.fecha_nacimiento,
            sexo: estudiante.Usuario.sexo
        };

        res.status(200).json(estudianteCompleto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createEstudiante,
    getAllEstudiantes,
    getEstudianteById
};