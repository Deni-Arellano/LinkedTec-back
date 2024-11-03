const WebSocket = require('ws');
const {setupWebSocketServer } = require('../controllers/mesnajes_controllers'); // Importa correctamente

const wss = new WebSocket.Server({ port: 8080 });

setupWebSocketServer(wss);

console.log('Servidor WebSocket en funcionamiento en ws://localhost:8080');