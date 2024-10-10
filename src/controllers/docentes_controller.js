const Docente = require('../models/docentes');
const Usuario = require('../models/usuarios');
const {validarRegistroDocente} = require('../middlewares/validations/validaciones_docentes');
const {validarEdicionDocente} = require('../middlewares/validations/validaciones_docentes');
const {validarNumeroDocente} = require('../middlewares/validations/validaciones_docentes');
const {validarUsuarioExistente, validarCorreoExistente,validarRegistroUsuario,validarUsuarioEnUso,validarUsuariosExistentes,validarUsuarioEnUsoPlanB} = require('../middlewares/validations/validaciones_usuarios');

const createDocente = async (req, res) => {
    try {
        const { usuario, docente } = req.body;

        // Validar los datos del docente
        const { error } = validarRegistroDocente(docente);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Validar los datos del usuario
        const { errorUsuario } = validarRegistroUsuario(usuario);
        if (errorUsuario) {
            return res.status(400).json({ error: errorUsuario.details[0].message });
        }

        // Validar si el correo ya está en uso
        await validarCorreoExistente(usuario.correo);

        await validarNumeroDocente(docente.numero_empleado);
        


        // Crear el nuevo usuario
        const nuevoUsuario = await Usuario.create(usuario);

        // Validar el nuevo usuario creado
        console.log("Nuevo usuario creado:", nuevoUsuario);

        // Validar que el usuario realmente se creó con un ID
        await validarUsuarioEnUsoPlanB(nuevoUsuario.id);

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
        console.error(`Error capturado: ${error.message}`); // Mensaje de error general

        // Imprimir más detalles del error, si están disponibles
        if (error.errors) {
            error.errors.forEach(err => {
                console.error(`Error de validación: ${err.message}`);
            });
        }

        if (error.name === 'EmailExistsError') {
            return res.status(400).json({ error: "El correo ya está en uso." });
        } else if (error.name === 'UserExistsError') {
            return res.status(400).json({ error: "El usuario ya existe." });
        } else if (error.name === 'UserNotFoundError') {
            return res.status(400).json({ error: "El usuario no existe." });
        }else if (error.name === 'ValidationNumberEmployeeError') {
            return res.status(400).json({ error: "El número de empleado ya está en uso." });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};



// Función para obtener todos los docentes
const getAllDocentes = async (req, res) => {
    try {
        const docentes = await Docente.findAll({
            include: [Usuario] // Incluye los datos del usuario asociado
        });

        await validarUsuariosExistentes(docentes);

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
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }else{res.status(500).json({ error: error.message });}  
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

        await validarUsuarioExistente(docente.id);

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
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }else {res.status(500).json({ error: error.message });}
    }
};

const getAllDocentesInfo = async (req, res) => {
    try {
        const docentes = await Docente.findAll({
            include: [Usuario] // Incluye los datos del usuario asociado
        });

        await validarUsuariosExistentes(docentes);

        const docentesConInfoUnica = docentes.map(docente => ({
            id: docente.id, // ID del docente
            ultimo_nivel_estudios: docente.ultimo_nivel_estudios,
            numero_empleado: docente.numero_empleado,
            academia: docente.academia
        }));

        res.status(200).json(docentesConInfoUnica);
    } catch (error) {
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: "Usuarios no encontrados." });
        }else{res.status(500).json({ error: error.message });}
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

        await validarUsuarioExistente(docente.id);

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
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }else{res.status(500).json({ error: error.message });}
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

        await validarUsuarioExistente(docente.id);

        // Retornar solo los datos solicitados
        const docenteInfoUnica = {
            id: docente.id,
            ultimo_nivel_estudios: docente.ultimo_nivel_estudios,
            numero_empleado: docente.numero_empleado,
            academia: docente.academia
        };

        res.status(200).json(docenteInfoUnica);
    } catch (error) {
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }else{res.status(500).json({ error: error.message });}
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

        await validarUsuarioExistente(docente.id);

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
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }else {res.status(500).json({ error: error.message });}
    }
};


const editDocente = async (req, res) => {
    try {
        const { usuario, docente } = req.body;

        const { error } = await validarEdicionDocente(docente); // Aquí validas solo el docente
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Buscar el usuario existente
        const usuarioExistente = await Usuario.findOne({ where: { id: req.params.id } });

        if (usuarioExistente) {
            // Actualizar datos del usuario
            usuarioExistente.nombre = usuario.nombre || usuarioExistente.nombre;
            usuarioExistente.apellido_paterno = usuario.apellido_paterno || usuarioExistente.apellido_paterno;
            usuarioExistente.apellido_materno = usuario.apellido_materno || usuarioExistente.apellido_materno;
            usuarioExistente.correo = usuario.correo || usuarioExistente.correo;
            usuarioExistente.telefono = usuario.telefono || usuarioExistente.telefono;
            usuarioExistente.sexo = usuario.sexo || usuarioExistente.sexo;
            usuarioExistente.biografia = usuario.biografia || usuarioExistente.biografia;
            usuarioExistente.role = usuario.role || usuarioExistente.role;

            await usuarioExistente.save();
        }

        // Buscar el docente existente
        const docenteExistente = await Docente.findOne({ where: { id: req.params.id } });

        if (docenteExistente) {
            // Actualizar datos del docente
            docenteExistente.ultimo_nivel_estudios = docente.ultimo_nivel_estudios || docenteExistente.ultimo_nivel_estudios;
            docenteExistente.numero_empleado = docente.numero_empleado || docenteExistente.numero_empleado;
            docenteExistente.academia = docente.academia || docenteExistente.academia;

            await docenteExistente.save();
        }

        res.status(200).json({ message: 'Docente actualizado correctamente' });
    } catch (error) {
        // Capturar el error de validación con más detalles
        if (error.errors && error.errors.length > 0) {
            console.error("Errores de validación:", error.errors);
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        console.error("Error capturado:", error);
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
    getUsuariRolById,
    editDocente
};