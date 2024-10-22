const express = require('express');
const {obtenerPostulacionesDeUsuario, crearPostulacion} = require('../controllers/postulaciones_controller');
const router = express.Router();


router.get('/:id', obtenerPostulacionesDeUsuario);
  

router.post('/', crearPostulacion);







module.exports = router;