const express = require('express');
const router = express.Router();
const seguidoresController = require('../controllers/seguidores_controller');

// Ruta para obtener la lista de usuarios seguidos por un usuario específico
router.get('/usuarios/:id_usuario/seguidos', seguidoresController.getUsuariosSeguidos);

router.get('/usuarios/:id_usuario/perfil', seguidoresController.getPerfilUsuario);


module.exports = router;