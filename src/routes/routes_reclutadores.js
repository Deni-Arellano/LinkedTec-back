const express = require('express');
const router = express.Router();
const {
  crearReclutador,
  obtenerReclutador,
  obtenerTodosReclutadores
} = require('../controllers/reclutadores_controllers');

/**
 * Ruta para crear un nuevo reclutador.
 * @name POST /
 * @function
 * @memberof module:router/reclutadores
 * @param {Object} req - El objeto de solicitud (request) de Express.
 * @param {Object} res - El objeto de respuesta (response) de Express.
 * @param {function} next - La función de middleware para pasar al siguiente middleware.
 */
router.post('', crearReclutador);

/**
 * Ruta para obtener un reclutador por su ID.
 * @name GET /perfil/:id
 * @function
 * @memberof module:router/reclutadores
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {function} next - La función de middleware.
 */
router.get('/perfil/:id', obtenerReclutador);

/**
 * Ruta para obtener todos los reclutadores.
 * @name GET /
 * @function
 * @memberof module:router/reclutadores
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {function} next - La función de middleware.
 */
router.get('', obtenerTodosReclutadores);

module.exports = router;
