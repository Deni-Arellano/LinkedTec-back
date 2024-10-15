const express = require('express');
const router = express.Router();
const EventoController = require('../controllers/eventos_controller');


//metodos GET
router.get('/', EventoController.obtenerEventos);//
router.get('/:id', EventoController.obtenerEventoById);//
router.get('/categoria/:categoria',EventoController.obtenerEventosByCategoria);//
//router.get('/fecha',EventoController.obtenerEventosByFecha);
router.get('/usuario/:id_usuario', EventoController.obtenerEventosByUsuario);  //
router.get('/:id_evento/asistencia', EventoController.obtenerUsuariosAsistentes);
router.get('/buscar/:titulo' , EventoController.buscarEventoPorTitulo);
//router.get('/buscar/populares',EventoController.obtenerEventosPopulares);





//metodos POST
router.post('/', EventoController.crearEvento);
router.post('/:id_evento/asistencia/:id_usuario', EventoController.registrarAsistenciaEvento);



//metodos DELETE
router.delete('/:id', EventoController.eliminarEvento);
router.delete('/:id_evento/asistencia/:id_usuario', EventoController.cancelarAsistenciaEvento);


//metodos PATCH
router.patch('/:id', EventoController.actualizarEvento);


module.exports = router;

