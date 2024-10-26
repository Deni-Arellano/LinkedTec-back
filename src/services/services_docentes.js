const Docente = require('../models/docentes');
const Usuario = require('../models/usuarios');
const { validarRegistroUsuario } = require('../middlewares/validations/validaciones_usuarios');
const { validarRegistroDocente, validarNumeroDocente } = require('../middlewares/validations/validaciones_docentes');
const { validarCorreoExistente } = require('../middlewares/validations/validaciones_usuarios');
const { validarDocenteExistente, validarEdicionDocente } = require('../middlewares/validations/validaciones_docentes');

const createDocente = async (usuario, docente) => {  // Aquí cambié de 'Docente' a 'docente'
    try {
        // Validamos los datos del docente
        const { error: errorDocente } = validarRegistroDocente(docente); // Usamos 'docente' en vez de 'Docente'
        if (errorDocente) {
            throw new Error(errorDocente.details[0].message);
        }

        // Validamos los datos del usuario
        const {error} = await validarRegistroUsuario(usuario);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }

        // Verificamos si el correo ya existe
        await validarCorreoExistente(usuario.correo);

        // Validamos el número de empleado
        await validarNumeroDocente(docente.numero_empleado);  // Usamos 'docente' en vez de 'Docente'

        // Creación del usuario
        const nuevoUsuario = await Usuario.create(usuario);

        // Creación del docente vinculado al usuario
        const nuevoDocente = await Docente.create({
            ultimo_nivel_estudios: docente.ultimo_nivel_estudios,  // Usamos 'docente' en vez de 'Docente'
            numero_empleado: docente.numero_empleado,  // Usamos 'docente' en vez de 'Docente'
            academia: docente.academia,  // Usamos 'docente' en vez de 'Docente'
            id: nuevoUsuario.id // Asignamos el ID del usuario como clave foránea
        });

        // Retornamos los datos completos
        return {
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
    } catch (error) {
        console.error(`Error en createDocente service: ${error.message}`);
        throw error; // Lanza el error para ser manejado en el Controller
    }
};


const getAllDocentesService = async (pagina, limite) => {
    const offset = (pagina - 1) * limite;

    const { rows: docentes, count } = await Docente.findAndCountAll({
        include: [Usuario],
        offset,
        limit: limite,
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
        academia: docente.academia,
    }));

    return { docentesCompletos, count };
};

const getDocenteByIdService = async (id) => {
    const docente = await Docente.findOne({
        where: { id: id },
        include: [Usuario],
    });

    if (!docente) {
        throw new Error("Docente no encontrado."); // Lanza un error si no se encuentra el docente
    }

    return docente;
};

const getAllDocentesInfoService = async (pagina, limite) => {
    const offset = (pagina - 1) * limite;

    const { rows: docentes, count } = await Docente.findAndCountAll({
        include: [Usuario],
        offset,
        limit: limite,
    });

    // Aquí podrías llamar a validarUsuariosExistentes si es necesario

    const docentesConInfoUnica = docentes.map(docente => ({
        id: docente.id,
        ultimo_nivel_estudios: docente.ultimo_nivel_estudios,
        numero_empleado: docente.numero_empleado,
        academia: docente.academia,
    }));

    return { docentes: docentesConInfoUnica, count }; // Devuelve los docentes y el conteo total
};

const getDocentePerfilByIdService = async (id) => {
    const docente = await Docente.findOne({
        where: { id: id },
        include: [Usuario],
    });

    if (!docente) {
        throw new Error("Docente no encontrado.");
    }

    // Devuelve el perfil del docente
    return {
        nombre: docente.Usuario.nombre,
        apellido_paterno: docente.Usuario.apellido_paterno,
        apellido_materno: docente.Usuario.apellido_materno,
        rol: docente.Usuario.role,
        academia: docente.academia,
        biografia: docente.Usuario.biografia,
        telefono: docente.Usuario.telefono,
        correo: docente.Usuario.correo,
        fecha_nacimiento: docente.Usuario.fecha_nacimiento,
        sexo: docente.Usuario.sexo,
    };
};


const getInfoDocenteByIdService = async (id) => {
    const docente = await Docente.findOne({
        where: { id: id },
    });

    if (!docente) {
        throw new Error("Docente no encontrado.");
    }

    // Devuelve la información única del docente
    return {
        id: docente.id,
        ultimo_nivel_estudios: docente.ultimo_nivel_estudios,
        numero_empleado: docente.numero_empleado,
        academia: docente.academia,
    };
};

const getUsuariRolByIdService = async (id) => {
    const docente = await Docente.findOne({
        where: { id: id },
        include: [Usuario], // Incluye el modelo Usuario
    });

    if (!docente) {
        throw new Error("Docente no encontrado.");
    }

    // Devuelve la información del docente y su usuario
    return {
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
};

const editDocenteService = async (docenteId, usuario, docente) => {
    await validarDocenteExistente(docenteId); // Verifica si el docente existe

    const { error } = await validarEdicionDocente(docente);
    if (error) {
        throw new Error(error.details[0].message); // Lanza un error si hay un problema de validación
    }

    const usuarioExistente = await Usuario.findOne({ where: { id: docenteId } });

    if (usuarioExistente) {
        // Actualiza los campos del usuario
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
    } else {
        throw new Error("Usuario no encontrado."); // Manejo del caso si el usuario no existe
    }

    const docenteExistente = await Docente.findOne({ where: { id: docenteId } });

    if (docenteExistente) {
        // Actualiza los campos del docente
        docenteExistente.numero_empleado = docente.numero_empleado || docenteExistente.numero_empleado;
        docenteExistente.ultimo_nivel_estudios = docente.ultimo_nivel_estudios || docenteExistente.ultimo_nivel_estudios;
        docenteExistente.academia = docente.academia || docenteExistente.academia;

        await docenteExistente.save();
    } else {
        throw new Error("Docente no encontrado."); // Manejo del caso si el docente no existe
    }

    return { message: 'Docente actualizado correctamente' }; // Devuelve un mensaje de éxito
};


module.exports = {
    createDocente,
    getAllDocentesService,
    getDocenteByIdService,
    getAllDocentesInfoService,
    getDocentePerfilByIdService,
    getInfoDocenteByIdService,
    getUsuariRolByIdService,
    editDocenteService,
};
