// routes/seguimiento_routes.js

const express = require('express');
const seguidoresController = require('../controllers/seguidores_controller');

const router = express.Router();

router.post('/', seguidoresController.gestionarSeguimiento);

// Ruta para obtener la lista de usuarios seguidos por un usuario específico
router.get('/usuarios/:id_usuario/seguidos', seguidoresController.getUsuariosSeguidos);

router.get('/usuarios/:id_usuario/perfil', seguidoresController.getPerfilUsuario);


module.exports = router;
