const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const WebSocket = require('ws');
require('dotenv').config();

const MensajesController = require('./controllers/mensajes_controller');
const CartasMensajesController = require('./controllers/Cartasmensjes_controllers');

const url = require('url');


const { manejodeconexion_notificaciones } = require('./controllers/notificaciones_controller');
const { enviarNotificacionesPorWebSocket } = require('./services/services_notificaciones');

const { actualizarReaccion } = require('./services/services_reaccion'); 




const comentariosRoutes = require('./routes/routes_comentarios');
const reclutadoresRoutes = require('./routes/routes_reclutadores');
const egresadosRoutes = require('./routes/routes_egresados');
const empleosRoutes = require('./routes/routes_empleos');
const routesDocentes = require('./routes/routes_docentes');
const routesEstudiantes = require('./routes/routes_estudiantes');
const routesUsuarios = require('./routes/routes_usuario');
const publicacionesRoutes = require('./routes/routes_publicaciones');
const routesImagenes = require('./routes/routes_imagenes');
const noticiasRoutes = require('./routes/routes_noticias');
const routesEventos = require('./routes/routes_eventos');
const reportesRoutes = require('./routes/routes_reportes');
const routerpostulaciones = require('./routes/routes_postulaciones');
const routerImagenes = require('./routes/subidas_cloudinary');
const routesLogin = require('./routes/routes_login');
const routesseguidores = require('./routes/routes_seguidores');
const routesEstadisticas = require('./routes/routes_estadisticas');
const app = express();
const port = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3001'
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas de la API
app.use('/publicaciones', publicacionesRoutes);
app.use('/publicaciones/comentarios', comentariosRoutes);
app.use('/usuarios/reclutadores', reclutadoresRoutes);
app.use('/usuarios/egresados', egresadosRoutes);
app.use('/empleos', empleosRoutes);
app.use('/usuarios/docentes', routesDocentes);
app.use('/usuarios/estudiantes', routesEstudiantes);
app.use('/usuarios', routesUsuarios);
app.use('/imagenes', routesImagenes);
app.use('/noticias', noticiasRoutes);
app.use('/eventos', routesEventos);
app.use('/reportes', reportesRoutes);
app.use('/postulaciones', routerpostulaciones);
app.use('/subidas', routerImagenes);
app.use('/acceso', routesLogin);
app.use('/seguimientos', routesseguidores);
app.use('/estadisticas', routesEstadisticas);
// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send('¡Hola, Mundo!');
});


const wss = new WebSocket.Server({ port: 9080 });
console.log('Servidor WebSocket en funcionamiento en ws://localhost:8080');

wss.on('connection', (ws, req) => {
    try {
      
        
      
        const parameters = url.parse(req.url, true).query;
        const { idUsuario, idChat } = parameters;

        if (!idUsuario || !idChat) {
            
            ws.close();
            return;
        }

        MensajesController.establecerConexionWS(ws, req, wss);

    } catch (error) {
        console.error('Error en la conexión:', error);
        ws.close();
    }
});




const wssNotificaciones = new WebSocket.Server({ port: 9081 });
console.log('Servidor WebSocket de Notificaciones en funcionamiento en ws://localhost:8081');

wssNotificaciones.on('connection', (ws, req) => {
    const id_usuario = new URL(req.url, `http://${req.headers.host}`).searchParams.get('id_usuario');
    ws.id_usuario = id_usuario;

    enviarNotificacionesPorWebSocket(wssNotificaciones, id_usuario);

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'nueva_notificacion') {
                manejodeconexion_notificaciones(ws, data);
            } else if (data.type === 'ping') {
                ws.send(JSON.stringify({ type: 'pong' }));
            }
        } catch (error) {
            ws.send(JSON.stringify({ error: 'Error interno en notificaciones' }));
            ws.close();
        }
    });

    ws.on('close', () => {
        // Cliente desconectado
    });

    ws.on('error', (error) => {
        // Error en conexión de notificaciones
    });
});



const wssReacciones = new WebSocket.Server({ port: 9082 });

console.log('Servidor WebSocket de Reacciones en funcionamiento en ws://localhost:8082');

wssReacciones.on('connection', (ws) => {
    console.log('Cliente conectado al servidor de reacciones');

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'nueva_reaccion') {
                const { id_publicacion, tipo_reaccion, id_usuario } = data;
                
                // Llamar a la función que maneja la reacción
                const { publicacion, haReaccionado } = await actualizarReaccion(id_publicacion, tipo_reaccion, wssReacciones, id_usuario);
                
                // Opcional: Responder al cliente sobre la reacción procesada (si es necesario)
                ws.send(JSON.stringify({
                    type: 'respuesta_reaccion',
                    publicacion,
                    haReaccionado
                }));
            } else {
                ws.send(JSON.stringify({ error: 'Tipo de mensaje no reconocido' }));
            }
        } catch (error) {
            console.error('Error al manejar la reacción:', error);
            ws.send(JSON.stringify({ error: 'Error interno en reacciones' }));
        }
    });

    ws.on('close', () => {
        console.log('Cliente desconectado del servidor de reacciones');
    });

    ws.on('error', (error) => {
        console.error('Error en conexión de reacciones:', error);
    });
});



// Ruta de la API para reaccionar a una publicación
app.post('/reaccionar', async (req, res) => {
    try {
      const { id_publicacion, tipo_reaccion, id_usuario } = req.body;
      const { publicacion, haReaccionado } = await actualizarReaccion(id_publicacion, tipo_reaccion, wssReacciones, id_usuario);
      res.json({ publicacion, haReaccionado });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });


const wssCartas = new WebSocket.Server({ port: 9083 });
console.log('Servidor WebSocket de Cartas Mensajes en funcionamiento en ws://localhost:8083');

wssCartas.on('connection', (ws, req) => {
    try {
        

        // Extraer idUsuario de la solicitud (req) o del mensaje inicial
        const urlParams = new URLSearchParams(req.url.replace('/?', ''));
        const idUsuario = urlParams.get('idUsuario');

        if (!idUsuario) {
            console.error('Falta el parámetro idUsuario en la conexión WebSocket');
            ws.close();
            return;
        }
        CartasMensajesController.manejarConexion(ws, req, wssCartas, idUsuario);

    } catch (error) {
        console.error('Error en la conexión de wssCartas:', error);
        ws.close();
    }
});








sequelize.sync()
    .then(() => sequelize.authenticate())
    .then(() => {
        app.listen(port, '0.0.0.0',() => {
            console.log(`Servidor escuchando en http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Error al iniciar la aplicación:', err);
        process.exit(1);
    });


process.on('SIGINT', () => {
    console.log('Cerrando servidores...');
    wss.close();
    wssNotificaciones.close();
    wssReacciones.close();
    wssCartas.close();
    process.exit(0);
});
