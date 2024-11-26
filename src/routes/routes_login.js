const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login_controller');

router.post('/login', loginController.login);
router.post('/login/recuperar', loginController.enviarCodigoRecuperacionController);
router.patch('/login/validar-cambiar', loginController.cambiarContraseñaController);

module.exports = router;
