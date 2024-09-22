const express = require('express');
const sequelize = require('./config/database');
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

const comentariosRoutes = require('./routes/routes_comentarios'); // Ajusta la ruta aquí
const reclutadoresRoutes = require('./routes/routes_reclutadores'); // Ajusta la ruta aquí

=======
const egresadosRoutes = require('./routes/routes_egresados');  // Asegúrate de que la ruta sea correcta
const empleosRoutes = require('./routes/routes_empleos');  // Asegúrate de que la ruta sea correcta
>>>>>>> MigueRosales
=======
const usuarioRoutes = require('./routes/routes_usuario');
const publicacionRoutes = require('./routes/routes_publicaciones');



>>>>>>> louis-alamo
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/publicaciones/comentarios', comentariosRoutes);

app.use('/usuarios/reclutadores', reclutadoresRoutes);
=======
const routesDocentes = require('./routes/routes_docentes');
const routesEstudiantes = require('./routes/routes_estudiantes');
const Usuario = require('./models/usuarios');
const Docente = require('./models/docentes');
const Estudiante = require('./models/estudiantes');

const app = express();
const PORT = 3000;
>>>>>>> Jony

app.use(express.json());
app.use(routesDocentes);
app.use(routesEstudiantes); // Asegúrate de incluir las rutas de estudiantes

<<<<<<< HEAD
// Configura las rutas de egresados con el prefijo /usuarios
app.use('/usuarios/egresados', egresadosRoutes);  // Cambiado para usar el prefijo /usuarios
app.use('/empleos', empleosRoutes);

=======
>>>>>>> Jony
app.get('/', (req, res) => {
    res.send('¡Hola, Mundo!');
});

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
// Define el puerto en el que el servidor escuchará
const PORT = process.env.PORT || 3000; // Cambia el puerto si es necesario
>>>>>>> MigueRosales

=======

app.use('/usuarios', usuarioRoutes);
app.use('/publicaciones', publicacionRoutes);



>>>>>>> louis-alamo
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
=======

// Define las asociaciones
Usuario.hasOne(Docente, { foreignKey: 'id' });
Docente.belongsTo(Usuario, { foreignKey: 'id' });
>>>>>>> Jony

Usuario.hasOne(Estudiante, { foreignKey: 'id' });
Estudiante.belongsTo(Usuario, { foreignKey: 'id' });

sequelize.sync({ force: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error al sincronizar la base de datos:', error);
    });
