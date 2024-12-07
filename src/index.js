const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const WebSocket = require('ws');
const url = require('url');
require('dotenv').config();

// Controladores y servicios
const MensajesController = require('./controllers/mensajes_controller');
const CartasMensajesController = require('./controllers/Cartasmensjes_controllers');
const { manejodeconexion_notificaciones } = require('./controllers/notificaciones_controller');
const { enviarNotificacionesPorWebSocket } = require('./services/services_notificaciones');
const { actualizarReaccion } = require('./services/services_reaccion');

// Importaciones de rutas
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
    origin: '*', // Permite cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));


// Middleware para parsear JSON
app.use(express.json());

// Configuración de rutas
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

// Crear un servidor WebSocket único con soporte para múltiples rutas
const wss = new WebSocket.Server({ noServer: true });

// Manejador de conexiones WebSocket
wss.on('connection', (ws, req, type) => {
    switch(type) {
        case 'mensajes':
            handleMensajesConnection(ws, req, wss);
            break;
        case 'notificaciones':
            handleNotificacionesConnection(ws, req);
            break;
        case 'reacciones':
            handleReaccionesConnection(ws, req);
            break;
        case 'cartas':
            handleCartasConnection(ws, req, wss);
            break;
        default:
            ws.close();
    }
});

// Funciones de manejo de conexiones WebSocket
function handleMensajesConnection(ws, req, wssServer) {
    try {
        const parameters = url.parse(req.url, true).query;
        const { idUsuario, idChat } = parameters;

        if (!idUsuario || !idChat) {
            ws.close();
            return;
        }

        MensajesController.establecerConexionWS(ws, req, wssServer);
    } catch (error) {
        console.error('Error en conexión de mensajes:', error);
        ws.close();
    }
}

function handleNotificacionesConnection(ws, req) {
    const id_usuario = new URL(req.url, `http://${req.headers.host}`).searchParams.get('id_usuario');
    ws.id_usuario = id_usuario;

    enviarNotificacionesPorWebSocket(wss, id_usuario);

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
}

function handleReaccionesConnection(ws) {
    console.log('Cliente conectado al servidor de reacciones');

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'nueva_reaccion') {
                const { id_publicacion, tipo_reaccion, id_usuario } = data;

                const { publicacion, haReaccionado } = await actualizarReaccion(id_publicacion, tipo_reaccion, wss, id_usuario);

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
}

function handleCartasConnection(ws, req, wssServer) {
    try {
        const urlParams = new URLSearchParams(req.url.replace('/?', ''));
        const idUsuario = urlParams.get('idUsuario');

        if (!idUsuario) {
            console.error('Falta el parámetro idUsuario en la conexión WebSocket');
            ws.close();
            return;
        }
        CartasMensajesController.manejarConexion(ws, req, wssServer, idUsuario);
    } catch (error) {
        console.error('Error en la conexión de cartas:', error);
        ws.close();
    }
}

// Ruta de la API para reaccionar a una publicación
app.post('/reaccionar', async (req, res) => {
    try {
        const { id_publicacion, tipo_reaccion, id_usuario } = req.body;
        const { publicacion, haReaccionado } = await actualizarReaccion(id_publicacion, tipo_reaccion, wss, id_usuario);
        res.json({ publicacion, haReaccionado });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Crear servidor HTTP con soporte de actualización de WebSocket
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Manejador de actualización de WebSocket
server.on('upgrade', (request, socket, head) => {
    const pathname = url.parse(request.url).pathname;

    if (pathname === '/mensajes') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request, 'mensajes');
        });
    } else if (pathname === '/notificaciones') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request, 'notificaciones');
        });
    } else if (pathname === '/reacciones') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request, 'reacciones');
        });
    } else if (pathname === '/cartas') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request, 'cartas');
        });
    } else {
        socket.destroy();
    }
});

// Sincronización de base de datos
sequelize.sync()
    .then(() => sequelize.authenticate())
    .catch(err => {
        console.error('Error al iniciar la aplicación:', err);
        process.exit(1);
    });

// Manejo de cierre graciado
process.on('SIGINT', () => {
    console.log('Cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});

module.exports = { server, wss }; // Exportar para posibles usos en pruebas o modules