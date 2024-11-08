const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const WebSocket = require('ws');
require('dotenv').config();

const { reaccionar } = require('./controllers/reaccion_controller'); 
const { manejodeconexion_notificaciones } = require('./controllers/notificaciones_controller');

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

const app = express();
const port = 3000;

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

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send('¡Hola, Mundo!');
});

// Configuración de WebSocket para notificaciones
const wssNotificaciones = new WebSocket.Server({ port: 8081 });
console.log('Servidor WebSocket de Notificaciones en funcionamiento en ws://localhost:8081');

wssNotificaciones.on('connection', (ws) => {
    console.log('Cliente conectado al servidor de notificaciones');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'nueva_notificacion') {
                manejodeconexion_notificaciones(ws, data);
            }
        } catch (error) {
            console.error('Error al manejar notificación:', error);
            ws.send(JSON.stringify({ error: 'Error interno en notificaciones' }));
            ws.close();
        }
    });

    ws.on('close', () => {
        console.log('Cliente desconectado del servidor de notificaciones');
    });

    ws.on('error', (error) => {
        console.error('Error en conexión de notificaciones:', error);
    });
});

const wssReacciones = new WebSocket.Server({ port: 8082 });

console.log('Servidor WebSocket de Reacciones en funcionamiento en ws://localhost:8082');

wssReacciones.on('connection', (ws) => {
    console.log('Cliente conectado al servidor de reacciones');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'nueva_reaccion') {
                if (data.reaccion === 'me_gusta' || data.reaccion === 'disgusta') {
                    notificarReaccion(data.reaccion);
                } else {
                    ws.send(JSON.stringify({ error: 'Reacción no válida' }));
                }
            } else {
                ws.send(JSON.stringify({ error: 'Tipo de mensaje no reconocido' }));
            }
        } catch (error) {
            console.error('Error al manejar reacción:', error);
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

// Función para notificar reacciones
const notificarReaccion = (reaccion) => {
    const tipo_reaccion = reaccion; 

    const mensaje = `Reacción: "${tipo_reaccion === 'me_gusta' ? 'Me gusta' : 'Disgusta'}" agregada.`;

    const conteo = tipo_reaccion === 'me_gusta' ? 28 : 12; 

    wssReacciones.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            const actualizacion = JSON.stringify({
                type: 'actualizacion_reaccion',
                mensaje: mensaje,
                conteo: conteo
            });
            client.send(actualizacion);
        }
    });
};

// Ruta de la API para reaccionar a una publicación
app.post('/reaccionar', (req, res) => {
    reaccionar(req, res, wssReacciones);
});


// Sincronización de la base de datos y servidor
sequelize.sync()
    .then(() => sequelize.authenticate())
    .then(() => {
        app.listen(port, () => {
            console.log(`Servidor escuchando en http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Error al iniciar la aplicación:', err);
        process.exit(1);
    });
