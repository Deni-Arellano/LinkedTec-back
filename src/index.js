const express = require('express');
const sequelize = require('./config/database');
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

app.use(express.json());

// Configura las rutas de egresados con el prefijo /usuarios
app.use('/usuarios/egresados', egresadosRoutes);  // Cambiado para usar el prefijo /usuarios
app.use('/empleos', empleosRoutes);

app.get('/', (req, res) => {
  res.send('Hola, Mundo!');
});

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

    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
