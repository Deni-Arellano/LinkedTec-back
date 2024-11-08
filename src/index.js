const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const ftpClient = require('./config/ftp');
require('dotenv').config();
const WebSocket = require('ws');
const MensajesController = require('./controllers/mensajes_controller');
const CartasMensajesController = require('./controllers/Cartasmensjes_controllers');
const {procesarMensaje} = require('./services/services_Cartasmensajes');
const url = require('url');








// Rutas
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



const app = express();
const port = 3000;

// Configuración de CORS para permitir solicitudes desde localhost:3001
app.use(cors({
    origin: 'http://localhost:3001'
}));

// Configuración de express para recibir y enviar datos en formato JSON
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
app.use('/subidas', routerImagenes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Hola, Mundo!');
});

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

const wss = new WebSocket.Server({ port: 8080 });
console.log('Servidor WebSocket en funcionamiento en ws://localhost:8080');

wss.on('connection', (ws, req) => {
    try {
        console.log('Nuevo cliente conectado');
        
      
        const parameters = url.parse(req.url, true).query;
        const { idUsuario, idChat } = parameters;

        if (!idUsuario || !idChat) {
            console.error('Faltan parámetros necesarios');
            ws.close();
            return;
        }

        MensajesController.establecerConexionWS(ws, req, wss);

    } catch (error) {
        console.error('Error en la conexión:', error);
        ws.close();
    }
});




const wssNotificaciones = new WebSocket.Server({ port: 8081 });
console.log('Servidor WebSocket de Notificaciones en funcionamiento en ws://localhost:8081');

wssNotificaciones.on('connection', (ws) => {
    console.log('Cliente conectado al servidor de notificaciones');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            // Manejo de eventos específicos para notificaciones
            if (data.type === 'nueva_notificacion') {
                enviarNotificacion(ws, data); // Función para enviar notificación específica
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

function enviarNotificacion(ws, data) {
    // Aquí envías notificaciones personalizadas al cliente
    ws.send(JSON.stringify({ tipo: 'notificacion', contenido: data.contenido }));
}



const wssReacciones = new WebSocket.Server({ port: 8082 });
console.log('Servidor WebSocket de Reacciones en funcionamiento en ws://localhost:8082');

wssReacciones.on('connection', (ws) => {
    console.log('Cliente conectado al servidor de reacciones');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            // Manejo de eventos específicos para reacciones
            if (data.type === 'nueva_reaccion') {
                notificarReaccion(ws, data); // Función para gestionar reacciones
            }

        } catch (error) {
            console.error('Error al manejar reacción:', error);
            ws.send(JSON.stringify({ error: 'Error interno en reacciones' }));
            ws.close();
        }
    });

    ws.on('close', () => {
        console.log('Cliente desconectado del servidor de reacciones');
    });

    ws.on('error', (error) => {
        console.error('Error en conexión de reacciones:', error);
    });
});

function notificarReaccion(ws, data) {
    // Aquí notificas a los usuarios sobre la nueva reacción
    ws.send(JSON.stringify({ tipo: 'reaccion', contenido: data.contenido }));
}


const wssCartas = new WebSocket.Server({ port: 8083 });
console.log('Servidor WebSocket de Cartas Mensajes en funcionamiento en ws://localhost:8083');

wssCartas.on('connection', (ws, req) => {
    try {
        console.log('Nuevo cliente conectado al servidor de Cartas Mensajes');

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
    .then(() => testFTPConnection())
    .then((ftpSuccess) => {
        console.log('Conexión a la base de datos exitosa y modelos sincronizados.');
        if (ftpSuccess) {
            app.listen(port, () => {
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