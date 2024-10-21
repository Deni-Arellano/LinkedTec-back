const Docente = require('../models/docentes');
const Usuario = require('../models/usuarios');
const {validarRegistroDocente} = require('../middlewares/validations/validaciones_docentes');
const {validarEdicionDocente} = require('../middlewares/validations/validaciones_docentes');
const {validarNumeroDocente} = require('../middlewares/validations/validaciones_docentes');
const {validarDocenteExistente} = require('../middlewares/validations/validaciones_docentes');
const {validarUsuarioExistente, validarCorreoExistente,validarRegistroUsuario,validarUsuarioEnUso,validarUsuariosExistentes,validarUsuarioEnUsoPlanB} = require('../middlewares/validations/validaciones_usuarios');

/**
 * Crea un nuevo docente y usuario en la base de datos.
 * 
 * @async
 * @function createDocente
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.body - El cuerpo de la solicitud.
 * @param {Object} req.body.usuario - Datos del usuario a crear.
 * @param {Object} req.body.docente - Datos del docente a crear.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Devuelve el docente y usuario creados en formato JSON o un error en caso de fallo.
 * @throws {Error} - Lanza un error si ocurre algún problema al crear el docente o usuario.
 */

const createDocente = async (req, res) => {
    try {
        const { usuario, docente } = req.body;

        const { error } = validarRegistroDocente(docente);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { errorUsuario } = validarRegistroUsuario(usuario);
        if (errorUsuario) {
            return res.status(400).json({ error: errorUsuario.details[0].message });
        }

        await validarCorreoExistente(usuario.correo);

        await validarNumeroDocente(docente.numero_empleado);
    
        const nuevoUsuario = await Usuario.create(usuario);

        console.log("Nuevo usuario creado:", nuevoUsuario);

        await validarUsuarioEnUsoPlanB(nuevoUsuario.id);

        const nuevoDocente = await Docente.create({
            ultimo_nivel_estudios: docente.ultimo_nivel_estudios,
            numero_empleado: docente.numero_empleado,
            academia: docente.academia,
            id: nuevoUsuario.id 
        });

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


/**
 * Obtiene una lista de todos los docentes con paginación.
 * 
 * @async
 * @function getAllDocentes
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} req.query - Parámetros de consulta (opcional).
 * @param {number} req.query.pagina - Número de página para paginación (opcional).
 * @param {number} req.query.limite - Número de resultados por página (opcional).
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} - Devuelve una lista de docentes paginada en formato JSON o un error.
 * @throws {Error} - Lanza un error si ocurre algún problema al obtener los docentes.
 */

const getAllDocentes = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1; 
        const limite = parseInt(req.query.limite) || 10; 

        const offset = (pagina - 1) * limite;
        const limit = limite;

        const { rows: docentes, count } = await Docente.findAndCountAll({
            include: [Usuario], 
            offset, 
            limit 
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

        const totalPaginas = Math.ceil(count / limite);

        const response = {
            total: count, 
            pagina: pagina, 
            limite: limite, 
            total_paginas: totalPaginas, 
            pagina_siguiente: pagina < totalPaginas ? pagina + 1 : null, 
            url_pagina_siguiente: pagina < totalPaginas ? `${req.protocol}://${req.get('host')}/usuarios/docentes?pagina=${pagina + 1}&limite=${limite}` : null,
            pagina_anterior: pagina > 1 ? pagina - 1 : null, 
            url_pagina_anterior: pagina > 1 ? `${req.protocol}://${req.get('host')}/usuarios/docentes?pagina=${pagina - 1}&limite=${limite}` : null,
            exists_pagina_siguiente: pagina < totalPaginas,
            exists_pagina_anterior: pagina > 1,
            docentes: docentesCompletos 
        };

        res.status(200).json(response);
    } catch (error) {
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: "Usuario no encontrado." });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};



/**
 * @function getDocenteById
 * @description Obtiene un docente por su ID, incluyendo los datos del usuario asociado.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.params - Los parámetros de la solicitud.
 * @param {string} req.params.id - El ID del docente a buscar.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Devuelve los datos completos del docente y su usuario asociado si se encuentra, de lo contrario un mensaje de error.
 */

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
            contraseña: docente.Usuario.contraseña,
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


/**
 * @function getAllDocentesInfo
 * @description Obtiene todos los docentes con información paginada, incluyendo los datos del usuario asociado, como el último nivel de estudios, número de empleado y academia.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.query - Los parámetros de consulta (query) de la solicitud.
 * @param {number} [req.query.pagina=1] - Número de la página actual para la paginación (por defecto 1).
 * @param {number} [req.query.limite=10] - Número de resultados por página (por defecto 10).
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Devuelve un objeto JSON con los datos de los docentes paginados, incluyendo la información de paginación y enlaces a las páginas anterior y siguiente.
 */

const getAllDocentesInfo = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1; 
        const limite = parseInt(req.query.limite) || 10; 

        const offset = (pagina - 1) * limite;

        const { rows: docentes, count } = await Docente.findAndCountAll({
            include: [Usuario], 
            offset, 
            limit: limite 
        });

        await validarUsuariosExistentes(docentes);

        const docentesConInfoUnica = docentes.map(docente => ({
            id: docente.id, // ID del docente
            ultimo_nivel_estudios: docente.ultimo_nivel_estudios,
            numero_empleado: docente.numero_empleado,
            academia: docente.academia
        }));

        const totalPaginas = Math.ceil(count / limite);

        const response = {
            total: count, 
            pagina: pagina, 
            limite: limite,
            total_paginas: totalPaginas, 
            pagina_siguiente: pagina < totalPaginas ? pagina + 1 : null, 
            url_pagina_siguiente: pagina < totalPaginas ? `${req.protocol}://${req.get('host')}/usuarios/docentes/info?pagina=${pagina + 1}&limite=${limite}` : null,
            pagina_anterior: pagina > 1 ? pagina - 1 : null, 
            url_pagina_anterior: pagina > 1 ? `${req.protocol}://${req.get('host')}/usuarios/docentes/info?pagina=${pagina - 1}&limite=${limite}` : null,
            exists_pagina_siguiente: pagina < totalPaginas,
            exists_pagina_anterior: pagina > 1,
            docentes: docentesConInfoUnica 
        };

        res.status(200).json(response);
    } catch (error) {
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: "Usuarios no encontrados." });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

/**
 * @function getDocentePerfilById
 * @description Obtiene el perfil de un docente específico, incluyendo la información del usuario asociada, como nombre, apellidos, rol, academia, biografía, y datos de contacto.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.params - Los parámetros de la solicitud.
 * @param {number} req.params.id - El ID del docente a buscar.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Devuelve un perfil completo del docente en formato JSON o un error si el docente o el usuario no son encontrados.
 */

const getDocentePerfilById = async (req, res) => {
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


/**
 * @function getinfoDocenteById
 * @description Obtiene información específica de un docente, incluyendo su ID, último nivel de estudios, número de empleado y academia.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.params - Los parámetros de la solicitud.
 * @param {number} req.params.id - El ID del docente a buscar.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Devuelve la información solicitada del docente en formato JSON o un error si el docente o el usuario no son encontrados.
 */

const getinfoDocenteById = async (req, res) => {
    try {
        const id = req.params.id;
        const docente = await Docente.findOne({
            where: { id: id }, 
        });

        if (!docente) {
            return res.status(404).json({ error: "Docente no encontrado." });
        }

        await validarUsuarioExistente(docente.id);

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

/**
 * @function getUsuariRolById
 * @description Obtiene la información de un docente junto con los detalles de su usuario asociado, incluyendo el rol y otros datos personales.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.params - Los parámetros de la solicitud.
 * @param {number} req.params.id - El ID del docente a buscar.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Devuelve la información del docente y su usuario en formato JSON o un error si el docente o el usuario no son encontrados.
 */

const getUsuariRolById = async (req, res) => {
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


/**
 * @function editDocente
 * @description Actualiza la información de un docente y su usuario asociado en la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} req.params - Los parámetros de la solicitud.
 * @param {number} req.params.id - El ID del docente a editar.
 * @param {Object} req.body - El cuerpo de la solicitud que contiene la información actualizada del usuario y del docente.
 * @param {Object} req.body.usuario - Los datos del usuario a actualizar.
 * @param {Object} req.body.docente - Los datos del docente a actualizar.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Devuelve un mensaje de éxito si la actualización se realiza correctamente o un error si hay problemas durante la actualización.
 */

const editDocente = async (req, res) => {
    try {
        const { usuario, docente } = req.body;
        const docenteId = req.params.id; 

        await validarDocenteExistente(docenteId);

        const { error } = await validarEdicionDocente(docente); 
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const usuarioExistente = await Usuario.findOne({ where: { id: docenteId } });

        if (usuarioExistente) {
            usuarioExistente.nombre = usuario.nombre || usuarioExistente.nombre;
            usuarioExistente.apellido_paterno = usuario.apellido_paterno || usuarioExistente.apellido_paterno;
            usuarioExistente.apellido_materno = usuario.apellido_materno || usuarioExistente.apellido_materno;
            usuarioExistente.correo = usuario.correo || usuarioExistente.correo;
            usuarioExistente.fecha_nacimiento = usuario.fecha_nacimiento || usuarioExistente.fecha_nacimiento;
            usuarioExistente.contraseña = usuario.contraseña || usuarioExistente.contraseña;
            usuarioExistente.telefono = usuario.telefono || usuarioExistente.telefono;
            usuarioExistente.sexo = usuario.sexo || usuarioExistente.sexo;
            usuarioExistente.biografia = usuario.biografia || usuarioExistente.biografia;
            usuarioExistente.role = usuario.role || usuarioExistente.role;

            await usuarioExistente.save();
        }

        const docenteExistente = await Docente.findOne({ where: { id: docenteId } });

        if (docenteExistente) {
            docenteExistente.numero_empleado = docente.numero_empleado || docenteExistente.numero_empleado;
            docenteExistente.ultimo_nivel_estudios = docente.ultimo_nivel_estudios || docenteExistente.ultimo_nivel_estudios;
            docenteExistente.academia = docente.academia || docenteExistente.academia;

            await docenteExistente.save();
        } else {
            return res.status(404).json({ error: "Docente no encontrado" });
        }

        res.status(200).json({ message: 'Docente actualizado correctamente' });
    } catch (error) {
        if (error.name === 'DocenteNotFoundError') {
            return res.status(404).json({ error: "Docente no encontrado." });
        }else {res.status(500).json({ error: error.message });}      // Capturar el error de validación con más detall
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