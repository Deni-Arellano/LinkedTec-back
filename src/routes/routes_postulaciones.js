const express = require('express');
const {obtenerPostulacionesDeUsuario,obtenerPostulacionCompleta} = require('../controllers/postulaciones_controller');
const router = express.Router();


  router.get('/:id', obtenerPostulacionesDeUsuario);

  router.get('/:id_usuario/:id_postulacion/info', obtenerPostulacionCompleta);
  









module.exports = router;