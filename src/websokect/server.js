const WebSocket = require('ws');
const { manejodeconexion } = require('../controllers/mesnajes_controllers');
const { manejodeconexion_notificaciones } = require('../controllers/notificaciones_controller');

// Configura el servidor WebSocket en el puerto 8080
const wss = new WebSocket.Server({ port: 8080 });
global.wss = wss;

wss.on('connection', (ws) => {
    
    ws.on('message', (message) => {
        
        const { tipo } = JSON.parse(message);

        if (tipo === 'mensajes') {
            manejodeconexion(wss, ws);
        } else if (tipo === 'notificaciones') {
            manejodeconexion_notificaciones(wss, ws);
        }
    });
});

console.log('Servidor WebSocket en funcionamiento en ws://localhost:8080');
