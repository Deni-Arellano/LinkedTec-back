const Docente = require('../models/docentes');
const Usuario = require('../models/usuarios');
const {validarRegistroDocente} = require('../middlewares/validations/validaciones_docentes');
const {validarEdicionDocente} = require('../middlewares/validations/validaciones_docentes');
const {validarNumeroDocente} = require('../middlewares/validations/validaciones_docentes');
const {validarDocenteExistente} = require('../middlewares/validations/validaciones_docentes');
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
        // Obtener los parámetros de paginación de la solicitud (usando 'pagina' y 'limite')
        const pagina = parseInt(req.query.pagina) || 1; // Página actual (por defecto 1)
        const limite = parseInt(req.query.limite) || 10; // Tamaño de página (por defecto 5)

        // Calcular el desplazamiento (offset) y el límite
        const offset = (pagina - 1) * limite;
        const limit = limite;

        // Obtener docentes con paginación
        const { rows: docentes, count } = await Docente.findAndCountAll({
            include: [Usuario], // Incluye los datos del usuario asociado
            offset, // Desplazamiento calculado
            limit // Límite de resultados por página
        });

        // Validar si hay docentes disponibles
        await validarUsuariosExistentes(docentes);

        // Mapear los resultados a la estructura que necesitas
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

        // Calcular el total de páginas
        const totalPaginas = Math.ceil(count / limite);

        // Preparar la respuesta con los datos de paginación y docentes
        const response = {
            total: count, // Número total de docentes
            pagina: pagina, // Página actual
            limite: limite, // Límite de resultados por página
            total_paginas: totalPaginas, // Total de páginas
            pagina_siguiente: pagina < totalPaginas ? pagina + 1 : null, // Página siguiente, si existe
            url_pagina_siguiente: pagina < totalPaginas ? `${req.protocol}://${req.get('host')}/usuarios/docentes?pagina=${pagina + 1}&limite=${limite}` : null,
            pagina_anterior: pagina > 1 ? pagina - 1 : null, // Página anterior, si existe
            url_pagina_anterior: pagina > 1 ? `${req.protocol}://${req.get('host')}/usuarios/docentes?pagina=${pagina - 1}&limite=${limite}` : null,
            exists_pagina_siguiente: pagina < totalPaginas,
            exists_pagina_anterior: pagina > 1,
            docentes: docentesCompletos // Lista de docentes en esta página
        };

        // Enviar la respuesta
        res.status(200).json(response);
    } catch (error) {
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: "Usuario no encontrado." });
        } else {
            res.status(500).json({ error: error.message });
        }
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

const getAllDocentesInfo = async (req, res) => {
    try {
        // Obtener los parámetros de paginación de la solicitud (usando 'pagina' y 'limite')
        const pagina = parseInt(req.query.pagina) || 1; // Página actual (por defecto 1)
        const limite = parseInt(req.query.limite) || 10; // Tamaño de página (por defecto 5)

        // Calcular el desplazamiento (offset) y el límite
        const offset = (pagina - 1) * limite;

        // Obtener docentes con paginación
        const { rows: docentes, count } = await Docente.findAndCountAll({
            include: [Usuario], // Incluye los datos del usuario asociado
            offset, // Desplazamiento calculado
            limit: limite // Límite de resultados por página
        });

        // Validar si hay docentes disponibles
        await validarUsuariosExistentes(docentes);

        // Mapear los resultados a la estructura que necesitas
        const docentesConInfoUnica = docentes.map(docente => ({
            id: docente.id, // ID del docente
            ultimo_nivel_estudios: docente.ultimo_nivel_estudios,
            numero_empleado: docente.numero_empleado,
            academia: docente.academia
        }));

        // Calcular el total de páginas
        const totalPaginas = Math.ceil(count / limite);

        // Preparar la respuesta con los datos de paginación y docentes
        const response = {
            total: count, // Número total de docentes
            pagina: pagina, // Página actual
            limite: limite, // Límite de resultados por página
            total_paginas: totalPaginas, // Total de páginas
            pagina_siguiente: pagina < totalPaginas ? pagina + 1 : null, // Página siguiente, si existe
            url_pagina_siguiente: pagina < totalPaginas ? `${req.protocol}://${req.get('host')}/usuarios/docentes/info?pagina=${pagina + 1}&limite=${limite}` : null,
            pagina_anterior: pagina > 1 ? pagina - 1 : null, // Página anterior, si existe
            url_pagina_anterior: pagina > 1 ? `${req.protocol}://${req.get('host')}/usuarios/docentes/info?pagina=${pagina - 1}&limite=${limite}` : null,
            exists_pagina_siguiente: pagina < totalPaginas,
            exists_pagina_anterior: pagina > 1,
            docentes: docentesConInfoUnica // Lista de docentes en esta página
        };

        // Enviar la respuesta
        res.status(200).json(response);
    } catch (error) {
        if (error.name === 'UserNotFoundError') {
            return res.status(404).json({ error: "Usuarios no encontrados." });
        } else {
            res.status(500).json({ error: error.message });
        }
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
        const docenteId = req.params.id; // Tomamos el ID de la URL

        // Validar si el docente existe por ID (tomado de los parámetros de la URL)
        await validarDocenteExistente(docenteId);


        const { error } = await validarEdicionDocente(docente); // Validar los datos del docente
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Buscar el usuario existente
        const usuarioExistente = await Usuario.findOne({ where: { id: docenteId } });

        if (usuarioExistente) {
            // Actualizar datos del usuario
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

        // Buscar el docente existente por ID
        const docenteExistente = await Docente.findOne({ where: { id: docenteId } });

        if (docenteExistente) {
            // Actualizar datos del docente
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