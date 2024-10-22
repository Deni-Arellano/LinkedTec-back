const express = require('express');
const {obtenerPostulacionesDeUsuario} = require('../controllers/postulaciones_controller');
const router = express.Router();


router.get('/:id', obtenerPostulacionesDeUsuario);
  









module.exports = router;