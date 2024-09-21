// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/controller_usuario');  // Asegúrate de que este nombre es correcto

// Ruta para crear un usuario
router.post('/', usuarioController.crearUsuario);

// Ruta para obtener un usuario por ID
router.get('/:id', usuarioController.obtenerUsuarioPorId);

// Ruta para obtener todos los usuarios
router.get('/', usuarioController.obtenerTodosLosUsuarios);

module.exports = router;
