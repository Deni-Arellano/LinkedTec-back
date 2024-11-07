const express = require('express'); 
const router = express.Router(); 
const usuarioController = require('../controllers/controller_usuario'); 

// Ruta para crear un nuevo usuario
// Método: POST
router.post('/', usuarioController.crearUsuario);

// Ruta para obtener un usuario por su ID
// Método: GET
router.get('/:id', usuarioController.obtenerUsuarioPorId);

// Ruta para obtener todos los usuarios
// Método: GET
router.get('/', usuarioController.obtenerTodosLosUsuarios);

router.get("/imagen/:id", usuarioController.obtenerImagenUsuario);

// Exporta el router para que pueda ser utilizado en la aplicación principal
module.exports = router;