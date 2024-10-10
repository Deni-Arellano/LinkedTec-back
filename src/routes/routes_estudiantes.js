const express = require('express');
const router = express.Router();
const EstudianteController = require('../controllers/estudiantes_controller');

// Ruta para crear un nuevo estudiante
router.post('/', EstudianteController.createEstudiante);

// Ruta para obtener todos los estudiantes
router.get('/', EstudianteController.getAllEstudiantes);

// Nueva ruta para obtener todos los estudiantes con su información única
router.get('/info', EstudianteController.getAllEstudiantesInfo); // Nueva ruta para información única

// Ruta para obtener un estudiante por ID
router.get('/:id', EstudianteController.getEstudianteById);

// Nueva ruta para obtener el perfil del estudiante
router.get('/perfil/:id', EstudianteController.getEstudiantePerfilById);

router.get('/:id/info', EstudianteController.getEstudianteInfoById); 

router.get('/:id/', EstudianteController.getEstudianteRolById); //

router.patch('/:id', EstudianteController.editEstudiante);

module.exports = router;