const WebSocket = require('ws');
const { manejodeconexion } = require('../controllers/mesnajes_controllers');
const { manejodeconexion_notificaciones } = require('../controllers/notificaciones_controller');

// Configura el servidor WebSocket en el puerto 8080
const wss = new WebSocket.Server({ port: 8080 });

// Maneja una única conexión que se suscribe a ambos tipos de eventos
wss.on('connection', (ws) => {
  // Pasar la conexión WebSocket a ambos controladores
  manejodeconexion(wss, ws); // Configura para escuchar y manejar mensajes
  manejodeconexion_notificaciones(wss, ws); // Configura para escuchar y manejar notificaciones
});

console.log('Servidor WebSocket en funcionamiento en ws://localhost:8080');
