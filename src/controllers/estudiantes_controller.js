const Estudiante = require('../models/estudiantes');
const Usuario = require('../models/usuarios');
const {validarRegistroEstudiante} = require('../middlewares/validations/validaciones_estudiantes');
const {validarEdicionEstudiante} = require('../middlewares/validations/validaciones_estudiantes');
const {validarNumeroControl} = require('../middlewares/validations/validaciones_estudiantes');
const {validarEstudianteExistente} = require('../middlewares/validations/validaciones_estudiantes');
const {validarUsuarioExistente, validarCorreoExistente,validarRegistroUsuario,validarUsuarioEnUso,validarUsuarioEnUsoPlanB, validarUsuariosExistentes} = require('../middlewares/validations/validaciones_usuarios');


/**
 * @function createEstudiante
 * @description Crea un nuevo estudiante y su usuario asociado en la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.body - El cuerpo de la solicitud que contiene la información del usuario y del estudiante.
 * @param {Object} req.body.usuario - Los datos del usuario a registrar.
 * @param {Object} req.body.estudiante - Los datos del estudiante a registrar.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Devuelve el objeto del estudiante completo si la creación se realiza correctamente o un error si hay problemas durante la creación.
 */

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

        const nuevoUsuario = await Usuario.create(usuario);

        await validarUsuarioEnUsoPlanB(nuevoUsuario.id);

        const nuevoEstudiante = await Estudiante.create({
            no_control: estudiante.no_control,
            carrera: estudiante.carrera,
            semestre: estudiante.semestre,
            id: nuevoUsuario.id 
        });

        const estudianteCompleto = {
            id: nuevoEstudiante.id, 
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


/**
 * @function getAllEstudiantes
 * @description Obtiene una lista paginada de todos los estudiantes y sus datos de usuario asociados.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.query - Los parámetros de consulta de la solicitud.
 * @param {number} [req.query.pagina=1] - El número de página a obtener (por defecto es 1).
 * @param {number} [req.query.limite=10] - El número de estudiantes por página (por defecto es 10).
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Devuelve un objeto que contiene la lista de estudiantes, información de paginación y el conteo total de estudiantes.
 */

const getAllEstudiantes = async (req, res) => {
    try {
       
        const pagina = parseInt(req.query.pagina) || 1; 
        const limite = parseInt(req.query.limite) || 10; 

        const offset = (pagina - 1) * limite;

        const { rows: estudiantes, count } = await Estudiante.findAndCountAll({
            include: [Usuario], 
            offset, 
            limit: limite
        });

        await validarUsuariosExistentes(estudiantes);

        const estudiantesCompletos = estudiantes.map(estudiante => ({
            id: estudiante.id, 
            no_control: estudiante.no_control, 
            nombre: estudiante.Usuario.nombre,
            apellido_paterno: estudiante.Usuario.apellido_paterno,
            apellido_materno: estudiante.Usuario.apellido_materno,
            rol: estudiante.Usuario.role,
            carrera: estudiante.carrera, 
            semestre: estudiante.semestre, 
            biografia: estudiante.Usuario.biografia,
            telefono: estudiante.Usuario.telefono,
            correo: estudiante.Usuario.correo,
            fecha_nacimiento: estudiante.Usuario.fecha_nacimiento,
            sexo: estudiante.Usuario.sexo
        }));

        const totalPaginas = Math.ceil(count / limite);

        const response = {
            total: count, 
            pagina: pagina, 
            limite: limite, 
            total_paginas: totalPaginas,
            pagina_siguiente: pagina < totalPaginas ? pagina + 1 : null, 
            url_pagina_siguiente: pagina < totalPaginas ? `${req.protocol}://${req.get('host')}/usuarios/estudiantes?pagina=${pagina + 1}&limite=${limite}` : null,
            pagina_anterior: pagina > 1 ? pagina - 1 : null,
            url_pagina_anterior: pagina > 1 ? `${req.protocol}://${req.get('host')}/usuarios/estudiantes?pagina=${pagina - 1}&limite=${limite}` : null,
            exists_pagina_siguiente: pagina < totalPaginas,
            exists_pagina_anterior: pagina > 1,
            estudiantes: estudiantesCompletos 
        };

        res.status(200).json(response);
    } catch (error) {
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.status(500).json({ error: error.message });
    }
};


/**
 * @function getEstudianteById
 * @description Obtiene los detalles de un estudiante específico por su ID, incluyendo la información de usuario asociada.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.params - Los parámetros de la solicitud.
 * @param {string} req.params.id - El ID del estudiante que se va a buscar.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Devuelve un objeto que contiene los detalles del estudiante y su información de usuario.
 */

const getEstudianteById = async (req, res) => {
    try {
        const id = req.params.id;
        const estudiante = await Estudiante.findOne({
            where: { id: id }, 
            include: [Usuario] 
        });

        if (!estudiante) {
            return res.status(404).json({ error: "Estudiante no encontrado." });
        }

        await validarUsuarioExistente(estudiante.id);

        const estudianteCompleto = {
            id: estudiante.id, 
            nombre: estudiante.Usuario.nombre,
            no_control: estudiante.no_control,
            semestre: estudiante.semestre,
            apellido_paterno: estudiante.Usuario.apellido_paterno,
            apellido_materno: estudiante.Usuario.apellido_materno,
            semestre: estudiante.semestre,
            no_control: estudiante.no_control,
            rol: estudiante.Usuario.role,
            carrera: estudiante.carrera,
            biografia: estudiante.Usuario.biografia,
            telefono: estudiante.Usuario.telefono,
            correo: estudiante.Usuario.correo,
            contraseña: estudiante.Usuario.contraseña,
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

/**
 * @function getAllEstudiantesInfo
 * @description Obtiene una lista paginada de estudiantes con información única (número de control, carrera y semestre) y datos de usuario asociados.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.query - Los parámetros de consulta de la solicitud.
 * @param {number} req.query.pagina - El número de la página a recuperar (por defecto es 1).
 * @param {number} req.query.limite - El número máximo de estudiantes por página (por defecto es 10).
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Devuelve un objeto que contiene información paginada de los estudiantes y sus datos únicos.
 */

const getAllEstudiantesInfo = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1; 
        const limite = parseInt(req.query.limite) || 10; 
        const offset = (pagina - 1) * limite;

        const { rows: estudiantes, count } = await Estudiante.findAndCountAll({
            include: [Usuario], 
            offset, 
            limit: limite 
        });

        await validarUsuariosExistentes(estudiantes);

        const estudiantesConInfoUnica = estudiantes.map(estudiante => ({
            id: estudiante.id,               
            no_control: estudiante.no_control, 
            carrera: estudiante.carrera,       
            semestre: estudiante.semestre       
        }));

        const totalPaginas = Math.ceil(count / limite);

        const response = {
            total: count, 
            pagina: pagina, 
            limite: limite, 
            total_paginas: totalPaginas, 
            pagina_siguiente: pagina < totalPaginas ? pagina + 1 : null, 
            url_pagina_siguiente: pagina < totalPaginas ? `${req.protocol}://${req.get('host')}/usuarios/estudiantes/info?pagina=${pagina + 1}&limite=${limite}` : null,
            pagina_anterior: pagina > 1 ? pagina - 1 : null, 
            url_pagina_anterior: pagina > 1 ? `${req.protocol}://${req.get('host')}/usuarios/estudiantes/info?pagina=${pagina - 1}&limite=${limite}` : null,
            exists_pagina_siguiente: pagina < totalPaginas,
            exists_pagina_anterior: pagina > 1,
            estudiantes: estudiantesConInfoUnica 
        };

        res.status(200).json(response);
    } catch (error) {
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.status(500).json({ error: error.message });
    }
};

/**
 * @function getEstudiantePerfilById
 * @description Obtiene el perfil de un estudiante específico mediante su ID. Incluye información del usuario asociado al estudiante.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.params - Los parámetros de la URL.
 * @param {string} req.params.id - El ID del estudiante a recuperar.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Devuelve el perfil del estudiante si se encuentra; de lo contrario, devuelve un error.
 */

const getEstudiantePerfilById = async (req, res) => {
    try {
        const id = req.params.id;
        const estudiante = await Estudiante.findOne({
            where: { id: id },
            include: [Usuario] 
        });

        if (!estudiante) {
            return res.status(404).json({ error: "Estudiante no encontrado." });
        }

        await validarUsuarioExistente(estudiante.id);

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

/**
 * @function getEstudianteInfoById
 * @description Obtiene la información básica de un estudiante específico mediante su ID. 
 * Incluye solo el número de control, carrera y semestre.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.params - Los parámetros de la URL.
 * @param {string} req.params.id - El ID del estudiante a recuperar.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Devuelve la información básica del estudiante si se encuentra; de lo contrario, devuelve un error.
 */

const getEstudianteInfoById = async (req, res) => {
    try {
        const id = req.params.id;
        const estudiante = await Estudiante.findOne({
            where: { id: id },
            attributes: ['id', 'no_control', 'carrera', 'semestre'] 
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


/**
 * @function getEstudianteRolById
 * @description Obtiene la información completa de un estudiante específico mediante su ID, incluyendo su rol y datos personales.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.params - Los parámetros de la URL.
 * @param {string} req.params.id - El ID del estudiante a recuperar.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Devuelve la información completa del estudiante si se encuentra; de lo contrario, devuelve un error.
 */

const getEstudianteRolById = async (req, res) => {
    try {
        const id = req.params.id;
        const estudiante = await Estudiante.findOne({
            where: { id: id },
            include: [Usuario] 
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


/**
 * @function editEstudiante
 * @description Edita la información de un estudiante específico, incluyendo su usuario asociado.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.body - El cuerpo de la solicitud que contiene los datos a editar.
 * @param {Object} req.body.usuario - Información del usuario asociada al estudiante.
 * @param {Object} req.body.estudiante - Información del estudiante a editar.
 * @param {Object} req.params - Los parámetros de la URL.
 * @param {string} req.params.id - El ID del estudiante a editar.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Devuelve un mensaje de éxito si la edición se realiza correctamente; de lo contrario, devuelve un error.
 */

const editEstudiante = async (req, res) => {
    try {
        const { usuario, estudiante } = req.body;

        const { error } = await validarEdicionEstudiante(estudiante);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        await validarEstudianteExistente(req.params.id);

        const usuarioExistente = await Usuario.findOne({ where: { id: req.params.id } });

        if (usuarioExistente) {
            usuarioExistente.nombre = usuario.nombre || usuarioExistente.nombre;
            usuarioExistente.apellido_paterno = usuario.apellido_paterno || usuarioExistente.apellido_paterno;
            usuarioExistente.apellido_materno = usuario.apellido_materno || usuarioExistente.apellido_materno;
            usuarioExistente.fecha_nacimiento = usuario.fecha_nacimiento || usuarioExistente.fecha_nacimiento;
            usuarioExistente.correo = usuario.correo || usuarioExistente.correo;
            usuarioExistente.contraseña = usuario.contraseña || usuarioExistente.contraseña;
            usuarioExistente.telefono = usuario.telefono || usuarioExistente.telefono;
            usuarioExistente.sexo = usuario.sexo || usuarioExistente.sexo;
            usuarioExistente.biografia = usuario.biografia || usuarioExistente.biografia;
            usuarioExistente.role = usuario.role || usuarioExistente.role;

            await usuarioExistente.save();
        }

        const estudianteExistente = await Estudiante.findOne({ where: { id: req.params.id } });

        if (estudianteExistente) {
            estudianteExistente.carrera = estudiante.carrera || estudianteExistente.carrera;
            estudianteExistente.semestre = estudiante.semestre || estudianteExistente.semestre; 

            await estudianteExistente.save();
        }

        res.status(200).json({ message: 'Estudiante actualizado correctamente' });
    } catch (error) {
        if (error.name === 'EstudianteNotFoundError') {
            return res.status(404).json({ error: 'Estudiante no encontrado.' });
        }else {res.status(500).json({ error: error.message
        });}

    }
};


module.exports = {
    createEstudiante,
    getAllEstudiantes,
    getEstudianteById,
    getAllEstudiantesInfo, 
    getEstudiantePerfilById,
    getEstudianteInfoById,
    getEstudianteRolById,
    editEstudiante
};