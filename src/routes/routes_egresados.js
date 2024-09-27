const express = require('express');
const router = express.Router();
const egresadosController = require('../controllers/egresados_controller');


/**
 * Ruta para crear un nuevo egresado
 */
router.post('/', egresadosController.createEgresado);

/**
 * Ruta para obtener la información única de todos los egresados (solo del rol)
 */
router.get('/info', egresadosController.getEgresadosInfo);

/**
 * Ruta para obtener la información tanto de usuario como del rol para todos los egresados
 */
router.get('/', egresadosController.getAllEgresadosWithUserInfo);

/**
 * Ruta para obtener todos los datos del perfil de un egresado específico
 */
router.get('/perfil/:id', egresadosController.getEgresadoProfileById);

/**
 * Ruta para obtener solo la información del rol de un egresado específico
 */
router.get('/:id/info', egresadosController.getEgresadoRoleInfoById);

/**
 * Ruta para obtener la información tanto del usuario como del rol de un egresado específico
 */
router.get('/:id', egresadosController.getEgresadoWithUserInfoById);

module.exports = router;
