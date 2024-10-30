const WebSocket = require('ws');
const { handleConnection } = require('../controllers/mesnajes_controllers'); // Importa correctamente

// Configura el servidor WebSocket en el puerto 8080
const wss = new WebSocket.Server({ port: 8080 });

// Maneja las conexiones mediante el controlador
wss.on('connection', (ws) => handleConnection(wss, ws));

console.log('Servidor WebSocket en funcionamiento en ws://localhost:8080');
