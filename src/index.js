const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const WebSocket = require('ws');
require('dotenv').config();


const { manejodeconexion_notificaciones } = require('./controllers/notificaciones_controller');

const { actualizarReaccion } = require('./services/services_reaccion'); // Asegúrate de que la ruta esté correcta


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
