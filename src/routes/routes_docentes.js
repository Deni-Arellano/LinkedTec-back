const express = require('express');
const router = express.Router();
const DocenteController = require('../controllers/docentes_controller');


// Ruta para crear un nuevo docente
router.post('/', DocenteController.createDocente);

// Ruta para obtener todos los docentes
router.get('/', DocenteController.getAllDocentes); // Esta ya existe

// Nueva ruta para obtener todos los docentes con su información única
router.get('/info', DocenteController.getAllDocentesInfo); // Nueva ruta para información única

// Ruta para obtener un docente por ID
router.get('/:id', DocenteController.getDocenteById);

// Nueva ruta para obtener el perfil del docente (usando el ID del cuerpo de la solicitud)
// Nueva ruta para obtener el perfil del docente por ID
router.get('/perfil/:id', DocenteController.getDocentePerfilById);

router.get('/:id/info', DocenteController.getinfoDocenteById); // Nueva ruta para obtener el rol

router.get('/:id/', DocenteController.getUsuariRolById); // Nueva ruta

router.patch('/:id', DocenteController.editDocente);

router.delete('/:id', DocenteController.deleteDocente);

module.exports = router;