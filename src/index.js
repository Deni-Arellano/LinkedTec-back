const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const ftpClient = require('./config/ftp');
const WebSocket = require('ws');
require('dotenv').config();

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
const loginRoutes = require('./routes/routes_login');
const routerImagenes = require('./routes/subidas_cloudinary');
const reaccionesRoutes = require('./routes/routes_reaccion');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });
const port = 3000;

app.use(cors({
    origin: 'http://localhost:3001'
}));

app.use(express.json());
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
app.use('/acceso', loginRoutes); 
app.use('/subidas', routerImagenes);
app.use('/reacciones', reaccionesRoutes);

app.get('/', (req, res) => {
    res.send('¡Hola, Mundo!');
});

// Prueba de conexión FTP
async function testFTPConnection() {
    try {
        await ftpClient.connect();
        return true;
    } catch (err) {
        console.error('Error al probar la conexión FTP:', err.message);
        return false;
    } finally {
        await ftpClient.disconnect();
    }
}

// Configuración del servidor WebSocket
wss.on('connection', (ws) => {
    console.log('Nuevo cliente conectado');

    // Escucha por mensajes desde el cliente
    ws.on('message', (message) => {
        console.log('Mensaje recibido:', message);
        // Aquí puedes procesar el mensaje recibido o reenviarlo a otros clientes
    });

    // Maneja la desconexión del cliente
    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

app.set('wss', wss); // Configura WebSocket para ser usado en otras partes de la aplicación

// Sincronización de la base de datos, prueba FTP y servidor
sequelize.sync()
    .then(() => sequelize.authenticate())
    .then(() => testFTPConnection())
    .then((ftpSuccess) => {
        console.log('Conexión a la base de datos exitosa y modelos sincronizados.');
        if (ftpSuccess) {
            server.listen(port, () => {
                console.log(`Servidor escuchando en http://localhost:${port}`);
            });
        } else {
            console.error('No se pudo iniciar el servidor debido a un error en la conexión FTP.');
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('Error al iniciar la aplicación:', err);
        process.exit(1);
    });
