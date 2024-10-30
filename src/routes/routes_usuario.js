// routes/usuarioRoutes.js
const express = require('express'); // Importa el módulo Express
const router = express.Router(); // Crea un router para manejar las rutas
const usuarioController = require('../controllers/controller_usuario'); // Importa el controlador de usuarios


// Ruta para crear un nuevo usuario
// Método: POST
router.post('/', usuarioController.crearUsuario);

// Ruta para obtener un usuario por su ID
// Método: GET
router.get('/:id', usuarioController.obtenerUsuarioPorId);

// Ruta para obtener todos los usuarios
// Método: GET
router.get('/', usuarioController.obtenerTodosLosUsuarios);

router.delete('/:id', usuarioController.eliminarUsuario);

// Exporta el router para que pueda ser utilizado en la aplicación principal
module.exports = router;