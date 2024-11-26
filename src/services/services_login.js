const Docente = require('../models/docentes');
const Usuario = require('../models/usuarios');
const Estudiante = require('../models/estudiantes');
const Egresado = require('../models/egresados');
const Reclutador = require('../models/reclutadores');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const Login = async (correo, contraseña) => {
    const usuario = await Usuario.findOne({ where: { correo, contraseña } }); 
    if (!usuario) {
        throw new Error('Correo o contraseña incorrectos');
    }

    const usuarioInfo = {
        id: usuario.id,
        tipoUsuario: usuario.role,
        nombre: usuario.nombre,
        apellido_paterno: usuario.apellido_paterno,
        apellido_materno: usuario.apellido_materno,
        correo: usuario.correo,
        telefono: usuario.telefono,
        fecha_nacimiento: usuario.fecha_nacimiento,
        sexo: usuario.sexo,
        biografia: usuario.biografia,
    };

    if (usuario.role === 'Docentes') {
        const docente = await Docente.findOne({ where: { id: usuario.id } });
        if (docente) {
            usuarioInfo.ultimo_nivel_estudios = docente.ultimo_nivel_estudios;
            usuarioInfo.numero_empleado = docente.numero_empleado;
            usuarioInfo.academia = docente.academia;
        }
    } else if (usuario.role === 'Estudiantes') {
        const estudiante = await Estudiante.findOne({ where: { id: usuario.id } });
        if (estudiante) {
            usuarioInfo.no_control = estudiante.no_control;
            usuarioInfo.carrera = estudiante.carrera;
            usuarioInfo.semestre = estudiante.semestre;
        }
    } else if (usuario.role === 'Egresados') {
        const egresado = await Egresado.findOne({ where: { id: usuario.id } });
        if (egresado) {
            usuarioInfo.carrera = egresado.carrera;
            usuarioInfo.año_graduacion = egresado.año_graduacion;
            usuarioInfo.puesto = egresado.puesto;
        }
    } else if (usuario.role === 'Reclutadores') {
        const reclutador = await Reclutador.findOne({ where: { id: usuario.id } });
        if (reclutador) {
            usuarioInfo.nombre_empresa = reclutador.nombre_empresa;
            usuarioInfo.sede = reclutador.sede;
            usuarioInfo.giro = reclutador.giro;
        }
    } else {
        throw new Error('Rol no válido');
    }

    return usuarioInfo;
};

const generarCodigoRecuperacion = () => {
    return crypto.randomBytes(3).toString('hex');
};

const enviarCodigoRecuperacion = async (correo) => {
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
        throw new Error('Correo no encontrado');
    }

    if (usuario.codigo_recuperacion && usuario.expiracion_codigo > new Date()) {
        throw new Error('Ya tienes un código activo, intenta generar otro más tarde');
    }

    const codigoRecuperacion = generarCodigoRecuperacion();
    const expiracionCodigo = new Date(Date.now() + 900000);

    usuario.codigo_recuperacion = codigoRecuperacion;
    usuario.expiracion_codigo = expiracionCodigo;
    await usuario.save();

    const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
            user: 'linked.tec.co@zohomail.com',
            pass: 'ARqqgm0eTH7g'
        }
    });

    const mailOptions = {
        from: 'linked.tec.co@zohomail.com',
        to: correo,
        subject: 'Código de Recuperación de Contraseña',
        text: `Tu código de recuperación es: ${codigoRecuperacion}`
    };

    await transporter.sendMail(mailOptions);
};

const validarCodigoRecuperacion = async (correo, codigo) => {
    const usuario = await Usuario.findOne({ where: { correo, codigo_recuperacion: codigo } });
    if (!usuario || usuario.expiracion_codigo < new Date()) {
        throw new Error('Código de recuperación inválido o expirado');
    }
    return usuario;
};

const cambiarContraseña = async (correo, nuevaContraseña) => {
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
        throw new Error('Correo no encontrado');
    }

    usuario.contraseña = nuevaContraseña;
    usuario.codigo_recuperacion = null;
    usuario.expiracion_codigo = null;
    await usuario.save();
};

module.exports = {
    Login,
    enviarCodigoRecuperacion,
    validarCodigoRecuperacion,
    cambiarContraseña
};
