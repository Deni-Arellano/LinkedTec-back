const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();

// Rutas
const comentariosRoutes = require('./routes/routes_comentarios');
const reclutadoresRoutes = require('./routes/routes_reclutadores');
const egresadosRoutes = require('./routes/routes_egresados');
const empleosRoutes = require('./routes/routes_empleos');
const routesDocentes = require('./routes/routes_docentes');
const routesEstudiantes = require('./routes/routes_estudiantes');
const routesUsuarios = require('./routes/routes_usuario');

const app = express();
const port = 3000;

// Configuración de CORS para permitir solicitudes desde localhost:3001
app.use(cors({
    origin: 'http://localhost:3001'
}));

app.use(express.json());

// Definición de rutas
app.use('/publicaciones/comentarios', comentariosRoutes);
app.use('/usuarios/reclutadores', reclutadoresRoutes);
app.use('/usuarios/egresados', egresadosRoutes);
app.use('/empleos', empleosRoutes);
app.use('/api/docentes', routesDocentes);
app.use('/api/estudiantes', routesEstudiantes);
app.use('/usuarios', routesUsuarios);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Hola, Mundo!');
});

// Sincronización de la base de datos y servidor
sequelize.sync()
    .then(() => sequelize.authenticate())
    .then(() => {
        console.log('Conexión a la base de datos exitosa y modelos sincronizados.');
        app.listen(port, () => {
            console.log(`Servidor escuchando en http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos o sincronizar los modelos:', err);
    });
