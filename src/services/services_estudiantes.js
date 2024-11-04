const Estudiante = require('../models/estudiantes');
const Usuario = require('../models/usuarios');
const {validarRegistroEstudiante} = require('../middlewares/validations/validaciones_estudiantes');
const {validarEdicionEstudiante} = require('../middlewares/validations/validaciones_estudiantes');
const {validarNumeroControl} = require('../middlewares/validations/validaciones_estudiantes');
const {validarEstudianteExistente} = require('../middlewares/validations/validaciones_estudiantes');
const {validarUsuarioExistente, validarCorreoExistente,validarRegistroUsuario,validarUsuarioEnUso,validarUsuarioEnUsoPlanB, validarUsuariosExistentes} = require('../middlewares/validations/validaciones_usuarios');



const createEstudiante = async (usuario, estudiante) => {
    try {
        const { error: errorEstudiante } = validarRegistroEstudiante(estudiante);
        if (errorEstudiante) {
            throw new Error(errorEstudiante.details[0].message);
        }

        const { error } = await validarRegistroUsuario(usuario);
        if (error) {
            throw new Error(error.details[0].message);
        }

        await validarCorreoExistente(usuario.correo);

        await validarNumeroControl(estudiante.no_control);

        const nuevoUsuario = await Usuario.create(usuario);

        const nuevoEstudiante = await Estudiante.create({
            no_control: estudiante.no_control,
            carrera: estudiante.carrera,
            semestre: estudiante.semestre,
            id: nuevoUsuario.id 
        });

        return {
            id: nuevoEstudiante.id,
            nombre: nuevoUsuario.nombre,
            apellido_paterno: nuevoUsuario.apellido_paterno,
            apellido_materno: nuevoUsuario.apellido_materno,
            rol: nuevoUsuario.role,
            biografia: nuevoUsuario.biografia,
            telefono: nuevoUsuario.telefono,
            correo: nuevoUsuario.correo,
            contraseña: nuevoUsuario.contraseña,
            fecha_nacimiento: nuevoUsuario.fecha_nacimiento,
            sexo: nuevoUsuario.sexo,
            carrera: nuevoEstudiante.carrera,
            semestre: nuevoEstudiante.semestre,
            no_control: nuevoEstudiante.no_control
        };
    } catch (error) {
        throw error;
    }
};


const getAllEstudiantesService = async (pagina, limite) => {
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

    return { estudiantesCompletos, total: count };
};

const getEstudianteByIdService = async (id) => {
    const estudiante = await Estudiante.findOne({
        where: { id: id }, 
        include: [Usuario]
    });

    if (!estudiante) {
        throw new Error("Estudiante no encontrado."); 
    }

    
    await validarUsuarioExistente(estudiante.id);

    const estudianteCompleto = {
        id: estudiante.id, 
        nombre: estudiante.Usuario.nombre,
        no_control: estudiante.no_control,
        semestre: estudiante.semestre,
        apellido_paterno: estudiante.Usuario.apellido_paterno,
        apellido_materno: estudiante.Usuario.apellido_materno,
        rol: estudiante.Usuario.role,
        carrera: estudiante.carrera,
        biografia: estudiante.Usuario.biografia,
        telefono: estudiante.Usuario.telefono,
        correo: estudiante.Usuario.correo,
        contraseña: estudiante.Usuario.contraseña,
        fecha_nacimiento: estudiante.Usuario.fecha_nacimiento,
        sexo: estudiante.Usuario.sexo
    };

    return estudianteCompleto;
};


const getAllEstudiantesInfoService = async (pagina, limite) => {
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

    return { estudiantesConInfoUnica, count }; 
};

const getEstudiantePerfilByIdService = async (id) => {
    const estudiante = await Estudiante.findOne({
        where: { id: id },
        include: [Usuario]
    });

    if (!estudiante) {
        throw new Error("Estudiante no encontrado.");
    }

    await validarUsuarioExistente(estudiante.id);

    const perfilEstudiante = {
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

    return perfilEstudiante; 
};


const getEstudianteInfoByIdService = async (id) => {
    const estudiante = await Estudiante.findOne({
        where: { id: id },
        attributes: ['id', 'no_control', 'carrera', 'semestre'] // Solo seleccionamos los atributos que necesitas
    });

    if (!estudiante) {
        throw new Error("Estudiante no encontrado.");
    }

    await validarUsuarioExistente(estudiante.id);

    return estudiante; 
};

const getEstudianteRolByIdService = async (id) => {
    const estudiante = await Estudiante.findOne({
        where: { id: id },
        include: [Usuario] 
    });

    if (!estudiante) {
        throw new Error("Estudiante no encontrado.");
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

    return respuesta; 
};


const editEstudianteService = async (id, usuarioData, estudianteData) => {
    const usuarioExistente = await Usuario.findOne({ where: { id } });
    if (!usuarioExistente) {
        throw new Error("Usuario no encontrado.");
    }

    usuarioExistente.nombre = usuarioData.nombre || usuarioExistente.nombre;
    usuarioExistente.apellido_paterno = usuarioData.apellido_paterno || usuarioExistente.apellido_paterno;
    usuarioExistente.apellido_materno = usuarioData.apellido_materno || usuarioExistente.apellido_materno;
    usuarioExistente.fecha_nacimiento = usuarioData.fecha_nacimiento || usuarioExistente.fecha_nacimiento;
    usuarioExistente.correo = usuarioData.correo || usuarioExistente.correo;
    usuarioExistente.contraseña = usuarioData.contraseña || usuarioExistente.contraseña;
    usuarioExistente.telefono = usuarioData.telefono || usuarioExistente.telefono;
    usuarioExistente.sexo = usuarioData.sexo || usuarioExistente.sexo;
    usuarioExistente.biografia = usuarioData.biografia || usuarioExistente.biografia;
    usuarioExistente.role = usuarioData.role || usuarioExistente.role;

    await usuarioExistente.save();

    const estudianteExistente = await Estudiante.findOne({ where: { id } });
    if (!estudianteExistente) {
        throw new Error("Estudiante no encontrado.");
    }

    estudianteExistente.carrera = estudianteData.carrera || estudianteExistente.carrera;
    estudianteExistente.semestre = estudianteData.semestre || estudianteExistente.semestre;

    await estudianteExistente.save();

    return { message: 'Estudiante actualizado correctamente' };
};

const deleteEstudianteService = async (id) => {
    const estudiante = await Estudiante.findByPk(id);

    if (!estudiante) {
        throw new Error('Estudiante no encontrado');
    }

    await estudiante.destroy();
    return { message: 'Estudiante eliminado exitosamente' };
};

module.exports = {
    createEstudiante,
    getAllEstudiantesService,
    getEstudianteByIdService,
    getAllEstudiantesInfoService,
    getEstudiantePerfilByIdService,
    getEstudianteInfoByIdService,
    getEstudianteRolByIdService,
    editEstudianteService,
    deleteEstudianteService
};