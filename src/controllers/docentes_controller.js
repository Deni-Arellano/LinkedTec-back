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
        const nuevoUsuario = await Usuario.create(usuario);

        // Crear el nuevo docente usando el id del nuevo usuario
        const nuevoDocente = await Docente.create({
            ultimo_nivel_estudios: docente.ultimo_nivel_estudios,
            numero_empleado: docente.numero_empleado,
            academia: docente.academia,
            id: nuevoUsuario.id // Asociar el id del usuario creado
        });

        // Retornar todos los datos
        const docenteCompleto = {
            id: nuevoDocente.id,
            nombre: nuevoUsuario.nombre,
            apellido_paterno: nuevoUsuario.apellido_paterno,
            apellido_materno: nuevoUsuario.apellido_materno,
            rol: nuevoUsuario.role,
            biografia: nuevoUsuario.biografia,
            telefono: nuevoUsuario.telefono,
            correo: nuevoUsuario.correo,
            fecha_nacimiento: nuevoUsuario.fecha_nacimiento,
            sexo: nuevoUsuario.sexo,
            ultimo_nivel_estudios: nuevoDocente.ultimo_nivel_estudios,
            numero_empleado: nuevoDocente.numero_empleado,
            academia: nuevoDocente.academia
        };

        res.status(201).json(docenteCompleto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.errors ? error.errors.map(e => e.message) : error.message });
    }
};

// Función para obtener todos los docentes
const getAllDocentes = async (req, res) => {
    try {
        const docentes = await Docente.findAll({
            include: [Usuario] // Incluye los datos del usuario asociado
        });

        const docentesCompletos = docentes.map(docente => ({
            id: docente.id,
            nombre: docente.Usuario.nombre,
            apellido_paterno: docente.Usuario.apellido_paterno,
            apellido_materno: docente.Usuario.apellido_materno,
            rol: docente.Usuario.role,
            biografia: docente.Usuario.biografia,
            telefono: docente.Usuario.telefono,
            correo: docente.Usuario.correo,
            fecha_nacimiento: docente.Usuario.fecha_nacimiento,
            sexo: docente.Usuario.sexo,
            ultimo_nivel_estudios: docente.ultimo_nivel_estudios,
            numero_empleado: docente.numero_empleado,
            academia: docente.academia
        }));

        res.status(200).json(docentesCompletos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Función para obtener un docente por ID
const getDocenteById = async (req, res) => {
    try {
        const id = req.params.id;
        const docente = await Docente.findOne({
            where: { id: id },
            include: [Usuario]
        });

        if (!docente) {
            return res.status(404).json({ error: "Docente no encontrado." });
        }

        const docenteCompleto = {
            id: docente.id,
            nombre: docente.Usuario.nombre,
            apellido_paterno: docente.Usuario.apellido_paterno,
            apellido_materno: docente.Usuario.apellido_materno,
            rol: docente.Usuario.role,
            biografia: docente.Usuario.biografia,
            telefono: docente.Usuario.telefono,
            correo: docente.Usuario.correo,
            fecha_nacimiento: docente.Usuario.fecha_nacimiento,
            sexo: docente.Usuario.sexo,
            ultimo_nivel_estudios: docente.ultimo_nivel_estudios,
            numero_empleado: docente.numero_empleado,
            academia: docente.academia
        };

        res.status(200).json(docenteCompleto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllDocentesInfo = async (req, res) => {
    try {
        const docentes = await Docente.findAll({
            include: [Usuario] // Incluye los datos del usuario asociado
        });

        const docentesConInfoUnica = docentes.map(docente => ({
            id: docente.id, // ID del docente
            ultimo_nivel_estudios: docente.ultimo_nivel_estudios,
            numero_empleado: docente.numero_empleado,
            academia: docente.academia
        }));

        res.status(200).json(docentesConInfoUnica);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Función para obtener el perfil del docente usando el ID del cuerpo de la solicitud
// Función para obtener el perfil del docente
// Función para obtener el perfil del docente
const getDocentePerfilById = async (req, res) => {
    try {
        const id = req.params.id;
        const docente = await Docente.findOne({
            where: { id: id },
            include: [Usuario] // Incluye los datos del usuario asociado
        });

        if (!docente) {
            return res.status(404).json({ error: "Docente no encontrado." });
        }

        // Perfil del docente
        const perfilDocente = {
            nombre: docente.Usuario.nombre,
            apellido_paterno: docente.Usuario.apellido_paterno,
            apellido_materno: docente.Usuario.apellido_materno,
            rol: docente.Usuario.role,
            academia: docente.academia,
            biografia: docente.Usuario.biografia,
            telefono: docente.Usuario.telefono,
            correo: docente.Usuario.correo,
            fecha_nacimiento: docente.Usuario.fecha_nacimiento,
            sexo: docente.Usuario.sexo
        };

        res.status(200).json(perfilDocente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Función para obtener la información única del docente por ID
const getinfoDocenteById = async (req, res) => {
    try {
        const id = req.params.id;
        const docente = await Docente.findOne({
            where: { id: id }, // Buscar por ID del docente
        });

        if (!docente) {
            return res.status(404).json({ error: "Docente no encontrado." });
        }

        // Retornar solo los datos solicitados
        const docenteInfoUnica = {
            id: docente.id,
            ultimo_nivel_estudios: docente.ultimo_nivel_estudios,
            numero_empleado: docente.numero_empleado,
            academia: docente.academia
        };

        res.status(200).json(docenteInfoUnica);
    } catch (error) {
        res.status(500).json({ error: "Error en la consulta." });
    }
};

// Función para obtener toda la información del usuario y su rol mediante ID
const getUsuariRolById = async (req, res) => {
    try {
        const id = req.params.id;
        const docente = await Docente.findOne({
            where: { id: id }, // Usar el ID del docente
            include: [Usuario] // Incluye los datos del usuario asociado
        });

        if (!docente) {
            return res.status(404).json({ error: "Docente no encontrado." });
        }

        const respuesta = {
            id: docente.id,
            nombre: docente.Usuario.nombre,
            apellido_paterno: docente.Usuario.apellido_paterno,
            apellido_materno: docente.Usuario.apellido_materno,
            rol: docente.Usuario.role,
            biografia: docente.Usuario.biografia,
            telefono: docente.Usuario.telefono,
            correo: docente.Usuario.correo,
            fecha_nacimiento: docente.Usuario.fecha_nacimiento,
            sexo: docente.Usuario.sexo,
            ultimo_nivel_estudios: docente.ultimo_nivel_estudios,
            numero_empleado: docente.numero_empleado,
            academia: docente.academia,
        };

        res.status(200).json(respuesta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createDocente,
    getAllDocentes,
    getDocenteById,
    getAllDocentesInfo, // Exportar la nueva función
    getDocentePerfilById,
    getinfoDocenteById,
    getUsuariRolById
};

