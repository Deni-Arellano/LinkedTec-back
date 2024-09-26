const express = require('express');
const router = express.Router();
const empleosController = require('../controllers/empleos_controller');

// Obtener todos los empleos
router.get('/', empleosController.getAllEmpleos);

// Crear un nuevo empleo
router.post('/', empleosController.createEmpleo);

// Obtener un empleo por ID
router.get('/:id_empleo', empleosController.getEmpleoPorId);

// Editar un empleo por ID (actualizar)
router.put('/:id_empleo', empleosController.updateEmpleo);

// Eliminar un empleo por ID
router.delete('/:id_empleo', empleosController.deleteEmpleo);

module.exports = router;