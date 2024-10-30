const { Login } = require('../services/services_login');
const { validarlogin } = require('../middlewares/validations/validaciones_login');

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
        res.status(401).json({ error: error.message });
    }
};

module.exports = { login };
