const express = require('express');
const router = express.Router();
const EventoController = require('../controllers/eventos_controller');


//metodos GET

router.get('/', EventoController.obtenerEventos);
router.get('/:id', EventoController.obtenerEventoById);
router.get('/categoria/:categoria',EventoController.obtenerEventosByCategoria);
router.get('/fecha',EventoController.obtenerEventosByFecha);
router.get('/usuario/:id_usuario', EventoController.obtenerEventosByUsuario);  
router.get('/:evento_id/asistencia', EventoController.obtenerUsuariosAsistentes);
router.get('/:evento_id/asistencia/:usuario_id', EventoController.obtenerEventosUsuarioAsistira);
router.get('/buscar' , EventoController.buscarEventoPorTitulo);
router.get('buscar/populares',EventoController.obtenerEventosPopulares);






//metodos POST
router.post('/', EventoController.crearEvento);
router.post('/:evento_id/asistencia/:usuario_id', EventoController.registrarAsistenciaEvento);



//metodos DELETE
router.delete('/:id', EventoController.eliminarEvento);
router.delete('/:evento_id/asistencia/:usuario_id', EventoController.cancelarAsistenciaEvento);


//metodos PATCH
router.patch('/:id', EventoController.actualizarEvento);


module.exports = router;

