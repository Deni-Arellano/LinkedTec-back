const Estudiante = require('../models/estudiantes');
const Usuario = require('../models/usuarios');
const {validarRegistroEstudiante} = require('../middlewares/validations/validaciones_estudiantes');
const {validarEdicionEstudiante} = require('../middlewares/validations/validaciones_estudiantes');
const {validarNumeroControl} = require('../middlewares/validations/validaciones_estudiantes');
const {validarEstudianteExistente} = require('../middlewares/validations/validaciones_estudiantes');
const {validarUsuarioExistente, validarCorreoExistente,validarRegistroUsuario,validarUsuarioEnUso,validarUsuarioEnUsoPlanB, validarUsuariosExistentes} = require('../middlewares/validations/validaciones_usuarios');
const estudiantesService = require('../services/services_estudiantes');
const { getAllEstudiantesService } = require('../services/services_estudiantes');
const { getEstudianteByIdService } = require('../services/services_estudiantes');
const { getAllEstudiantesInfoService } = require('../services/services_estudiantes');
const { getEstudiantePerfilByIdService } = require('../services/services_estudiantes');
const { getEstudianteInfoByIdService } = require('../services/services_estudiantes');
const { getEstudianteRolByIdService } = require('../services/services_estudiantes');
const { editEstudianteService } = require('../services/services_estudiantes');
const { deleteEstudianteService } = require('../services/services_estudiantes');


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

        const { error: errorEstudiante } = validarRegistroEstudiante(estudiante);
        if (errorEstudiante) {
            return res.status(400).json({ error: errorEstudiante.details[0].message });
        }

        const { error } = await validarRegistroUsuario(usuario);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        await validarCorreoExistente(usuario.correo);

        await validarNumeroControl(estudiante.no_control);

        const nuevoEstudiante = await estudiantesService.createEstudiante(usuario, estudiante);

        res.status(201).json(nuevoEstudiante);

    } catch (error) {

        if (error.errors) {
            error.errors.forEach(err => {
                console.error(`Error de validación: ${err.message}`);
            });
        }

        if (error.name === 'EmailExistsError') {
            return res.status(400).json({ error: 'El correo ya está en uso.' });
        } else if (error.name === 'UserExistsError') {
            return res.status(400).json({ error: 'El usuario ya está en uso.' });
        } else if (error.name === 'ValidationNumberStudentError') {
            return res.status(400).json({ error: 'El número de control no debe de repetirse.' });
        } else {
            res.status(500).json({ error: error.message });
        }
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

        // Llama al servicio para obtener los estudiantes
        const { estudiantesCompletos, total } = await getAllEstudiantesService(pagina, limite);

        const totalPaginas = Math.ceil(total / limite);

        const response = {
            total, 
            pagina, 
            limite, 
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

        // Llama al servicio para obtener el estudiante por ID
        const estudianteCompleto = await getEstudianteByIdService(id);

        res.status(200).json(estudianteCompleto);
    } catch (error) {
        if (error.message === 'Estudiante no encontrado.') {
            return res.status(404).json({ error: 'Estudiante no encontrado.' });
        } else {
            res.status(500).json({ error: error.message });
        }
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

        const { estudiantesConInfoUnica, count } = await getAllEstudiantesInfoService(pagina, limite);

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

        const perfilEstudiante = await getEstudiantePerfilByIdService(id);

        res.status(200).json(perfilEstudiante);
    } catch (error) {
        if (error.message === 'Estudiante no encontrado.') {
            return res.status(404).json({ error: 'Estudiante no encontrado.' });
        } else if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.status(500).json({ error: error.message });
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

        const estudiante = await getEstudianteInfoByIdService(id);

        res.status(200).json(estudiante);
    } catch (error) {
        if (error.message === 'Estudiante no encontrado.') {
            return res.status(404).json({ error: 'Estudiante no encontrado.' });
        } else if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.status(500).json({ error: error.message });
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

        const respuesta = await getEstudianteRolByIdService(id);

        res.status(200).json(respuesta);
    } catch (error) {
        if (error.message === 'Estudiante no encontrado.') {
            return res.status(404).json({ error: 'Estudiante no encontrado.' });
        } else if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.status(500).json({ error: error.message });
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

        const response = await editEstudianteService(req.params.id, usuario, estudiante);

        res.status(200).json(response);
    } catch (error) {
        if (error.message === 'Estudiante no encontrado.') {
            return res.status(404).json({ error: 'Estudiante no encontrado.' });
        } else if (error.message === 'Usuario no encontrado.') {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.status(500).json({ error: error.message });
    }
};

const deleteEstudiante = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await deleteEstudianteService(id);

        res.status(200).json(result);
    } catch (error) {

        if (error.message === 'Estudiante no encontrado') {
            return res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error al eliminar el estudiante: ' + error.message });
        }
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
    editEstudiante,
    deleteEstudiante
};