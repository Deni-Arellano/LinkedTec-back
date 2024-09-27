const express = require('express');
const router = express.Router();
const empleosController = require('../controllers/empleos_controller');

/** 
 * Ruta para crear empleos
 */
router.get('/', empleosController.getAllEmpleos);

/** 
 * Ruta para obtener todos los empleos
 */
router.post('/', empleosController.createEmpleo);

/**
 * Ruta para obtener un empleo por ID
 */
router.get('/:id_empleo', empleosController.getEmpleoPorId);

/**
 * Ruta para editar un empleo
 */
router.put('/:id_empleo', empleosController.updateEmpleo);

/**
 * Ruta para eliminar un empleo
 */
router.delete('/:id_empleo', empleosController.deleteEmpleo);

module.exports = router;
