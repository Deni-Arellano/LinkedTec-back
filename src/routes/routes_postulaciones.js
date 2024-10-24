const express = require('express');
const {crearPostulacion,obtenerPostulacionesDeUsuario,obtenerPostulacionCompleta, obtenerPostulantesPorEmpleoController, obtenerDetallesPostulanteController} = require('../controllers/postulaciones_controller');
const router = express.Router();


router.get('/:id', obtenerPostulacionesDeUsuario);

  router.get('/:id_postulacion/info', obtenerPostulacionCompleta);



  router.get('/empleo/:id_empleo', obtenerPostulantesPorEmpleoController);
  

  router.get('/postulante/:id_empleo/:id_usuario', obtenerDetallesPostulanteController);


router.post('/', crearPostulacion)







module.exports = router;