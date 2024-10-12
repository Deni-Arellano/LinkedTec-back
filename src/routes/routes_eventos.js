const express = require('express');
const router = express.Router();
const EventoController = require('../controllers/eventos_controller');


router.post('/', EventoController.crearEvento);


module.exports = router;

ALTER TABLE evento ADD COLUMN id_usuario INT NOT NULL;

ALTER TABLE evento ADD CONSTRAINT fk_usuario_evento FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE;