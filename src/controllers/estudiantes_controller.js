const Estudiante = require('../models/estudiantes');
const Usuario = require('../models/usuarios');
const {validarRegistroEstudiante} = require('../middlewares/validations/validaciones_estudiantes');
const {validarNumeroControl} = require('../middlewares/validations/validaciones_estudiantes');
const {validarUsuarioExistente, validarCorreoExistente,validarRegistroUsuario,validarUsuarioEnUso,validarUsuarioEnUsoPlanB, validarUsuariosExistentes} = require('../middlewares/validations/validaciones_usuarios');

// Función para crear un nuevo estudiante
const createEstudiante = async (req, res) => {
    try {
        const { usuario, estudiante } = req.body;
        
        const { error } = validarRegistroEstudiante(estudiante);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { errorUsuario } = validarRegistroUsuario(usuario);
        if (errorUsuario) {
            return res.status(400).json({ error: errorUsuario.details[0].message });
        }

        await validarCorreoExistente(usuario.correo);

        await validarNumeroControl(estudiante.no_control);


        

        // Crear el nuevo usuario
        const nuevoUsuario = await Usuario.create(usuario);

        await validarUsuarioEnUsoPlanB(nuevoUsuario.id);

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
        if (error.name ==='EmailExistsError') {
            return res.status(400).json({ error: 'El correo ya está en uso.' });
        }else if (error.name === 'UserExistsError') {
            return res.status(400).json({ error: 'El usuario ya está en uso.' });
        }else if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }else if (error.name === 'ValidationNumberStudentError') {
            return res.status(400).json({ error: 'El número de control no debe de repetirse.' });
        }else {res.status(500).json({ error: error.message });}  
    }
};

// Función para obtener todos los estudiantes
// Función para obtener todos los estudiantes
const getAllEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.findAll({
            include: [Usuario] // Incluye los datos del usuario asociado
        });

        await validarUsuariosExistentes(estudiantes);

        const estudiantesCompletos = estudiantes.map(estudiante => ({
            id: estudiante.id, // ID del estudiante
            no_control: estudiante.no_control, // No de control del estudiante
            nombre: estudiante.Usuario.nombre,
            apellido_paterno: estudiante.Usuario.apellido_paterno,
            apellido_materno: estudiante.Usuario.apellido_materno,
            rol: estudiante.Usuario.role,
            carrera: estudiante.carrera, // Carrera del estudiante
            semestre: estudiante.semestre, // Semestre del estudiante
            biografia: estudiante.Usuario.biografia,
            telefono: estudiante.Usuario.telefono,
            correo: estudiante.Usuario.correo,
            fecha_nacimiento: estudiante.Usuario.fecha_nacimiento,
            sexo: estudiante.Usuario.sexo
        }));

        res.status(200).json(estudiantesCompletos);
    } catch (error) {
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
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

        await validarUsuarioExistente(estudiante.id);

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
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }else {res.status(500).json({ error: error.message });} 
    }
};

// Función para obtener información específica de los estudiantes
const getAllEstudiantesInfo = async (req, res) => {
    try {
        const estudiantes = await Estudiante.findAll({
            include: [Usuario] // Incluye los datos del usuario asociado
        });

        await validarUsuariosExistentes(estudiantes);

        const estudiantesConInfoUnica = estudiantes.map(estudiante => ({
            id: estudiante.id,               // ID del estudiante
            no_control: estudiante.no_control, // NO_CONTROL del estudiante
            carrera: estudiante.carrera,       // CARRERA del estudiante
            semestre: estudiante.semestre       // SEMESTRE del estudiante
        }));

        res.status(200).json(estudiantesConInfoUnica);
    } catch (error) {
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }else {res.status(500).json({ error: error.message });}
    }
};

const getEstudiantePerfilById = async (req, res) => {
    try {
        const id = req.params.id;
        const estudiante = await Estudiante.findOne({
            where: { id: id },
            include: [Usuario] // Incluye los datos del usuario asociado
        });

        if (!estudiante) {
            return res.status(404).json({ error: "Estudiante no encontrado." });
        }

        await validarUsuarioExistente(estudiante.id);

        // Perfil del estudiante
        const perfilEstudiante = {
            nombre: estudiante.Usuario.nombre,
            apellido_paterno: estudiante.Usuario.apellido_paterno,
            apellido_materno: estudiante.Usuario.apellido_materno,
            rol : estudiante.Usuario.role,
            biografia: estudiante.Usuario.biografia,
            telefono: estudiante.Usuario.telefono,
            correo: estudiante.Usuario.correo,
            fecha_nacimiento: estudiante.Usuario.fecha_nacimiento,
            sexo: estudiante.Usuario.sexo
        };

        res.status(200).json(perfilEstudiante);
    } catch (error) {
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }else {res.status(500).json({ error: error.message });}
    }
};

// Función para obtener información específica del estudiante por ID
const getEstudianteInfoById = async (req, res) => {
    try {
        const id = req.params.id;
        const estudiante = await Estudiante.findOne({
            where: { id: id },
            attributes: ['id', 'no_control', 'carrera', 'semestre'] // Solo los atributos necesarios
        });

        await validarUsuarioExistente(estudiante.id);

        if (!estudiante) {
            return res.status(404).json({ error: "Estudiante no encontrado." });
        }

        res.status(200).json(estudiante);
    } catch (error) {
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }else {res.status(500).json({ error: error.message });}
    }
};

const getEstudianteRolById = async (req, res) => {
    try {
        const id = req.params.id;
        const estudiante = await Estudiante.findOne({
            where: { id: id },
            include: [Usuario] // Incluye los datos del usuario asociado
        });

        if (!estudiante) {
            return res.status(404).json({ error: "Estudiante no encontrado." });
        }

        await validarUsuarioExistente(estudiante.id);

        const respuesta = {
            id: estudiante.id,
            no_control: estudiante.no_control,
            carrera: estudiante.carrera,
            semestre: estudiante.semestre,
            nombre: estudiante.Usuario.nombre,
            apellido_paterno: estudiante.Usuario.apellido_paterno,
            apellido_materno: estudiante.Usuario.apellido_materno,
            rol: estudiante.Usuario.role,
            biografia: estudiante.Usuario.biografia,
            telefono: estudiante.Usuario.telefono,
            correo: estudiante.Usuario.correo,
            fecha_nacimiento: estudiante.Usuario.fecha_nacimiento,
            sexo: estudiante.Usuario.sexo
        };

        res.status(200).json(respuesta);
    } catch (error) {
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }else {res.status(500).json({ error: error.message });}
    }
};
// Exportar funciones
module.exports = {
    createEstudiante,
    getAllEstudiantes,
    getEstudianteById,
    getAllEstudiantesInfo, // Exportar la nueva función
    getEstudiantePerfilById,
    getEstudianteInfoById,
    getEstudianteRolById
};