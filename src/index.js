const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const ftpClient = require('./config/ftp');
require('dotenv').config();

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

// Sincronización de la base de datos, prueba FTP y servidor
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