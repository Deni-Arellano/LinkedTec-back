const Docente = require('../models/docentes');
const Usuario = require('../models/usuarios');
const Estudiante = require('../models/estudiantes');
const Egresado = require('../models/egresados');
const Reclutador = require('../models/reclutadores');


const Login = async (correo, contraseña) => {
    const tablas = [
        { modelo: Usuario, tipoUsuario: 'Usuario' },
    ];

    for (const { modelo, tipoUsuario } of tablas) {
        const usuario = await modelo.findOne({ where: { correo, contraseña } }); // Verifica directamente

        if (usuario) {
            return { id: usuario.id, tipoUsuario, nombre: usuario.nombre, role: usuario.role };
        }
    }

    throw new Error('Correo o contraseña incorrectos');
};

module.exports = {
    Login
};
