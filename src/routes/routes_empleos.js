const express = require('express');
const router = express.Router();
const empleosController = require('../controllers/empleos_controller');

/** 
 * Ruta para obtener todos empleos
 */
router.get('/', empleosController.getAllEmpleos);

/** 
 * Ruta para crear empleos
 */
router.post('/', empleosController.createEmpleo);

/**
 * Ruta para obtener un empleo por ID
 */
router.get('/:id_empleo', empleosController.getEmpleoPorId);

/**
 * Ruta para editar un empleo
 */
router.patch('/:id_empleo', empleosController.updateEmpleo);

/**
 * Ruta para eliminar un empleo
 */
router.delete('/:id_empleo', empleosController.deleteEmpleo);

module.exports = router;