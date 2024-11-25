const { Login, enviarCodigoRecuperacion, validarCodigoRecuperacion, cambiarContraseña } = require('../services/services_login');
const { validarlogin } = require('../middlewares/validations/validaciones_login');
const { validarNuevaContraseña } = require('../middlewares/validations/validaciones_usuarios');

const login = async (req, res) => {
    const { error } = validarlogin(req.body); 
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { correo, contraseña } = req.body;

    try {
        const usuario = await Login(correo, contraseña);

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            usuario: usuario,
        });
    } catch (error) {
        res.status(401).json({ mensaje: error.message });
    }
};

const enviarCodigoRecuperacionController = async (req, res) => {
    const { correo } = req.body;

    try {
        await enviarCodigoRecuperacion(correo);
        res.status(200).json({ message: 'Código de recuperación enviado. Valido 15 minutos' });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

const cambiarContraseñaController = async (req, res) => {
    const { correo, nuevaContraseña, codigo } = req.body;

    const { error } = validarNuevaContraseña(nuevaContraseña);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        await validarCodigoRecuperacion(correo, codigo);

        await cambiarContraseña(correo, nuevaContraseña);
        res.status(200).json({ message: 'Contraseña cambiada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.' });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};

module.exports = { 
    login,
    enviarCodigoRecuperacionController,
    cambiarContraseñaController
};
