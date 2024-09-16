// src/index.js
const express = require('express');
const sequelize = require('./config/database');
const egresadosRoutes = require('./routes/routes_egresados');  // Asegúrate de que la ruta sea correcta
require('dotenv').config();

const app = express();

app.use(express.json());

// Define el puerto en el que el servidor escuchará
const PORT = process.env.PORT || 3000;

// Configura una ruta que responde con "Hola, Mundo"
app.get('/', (req, res) => {
  res.send('Hola, Mundo!');
});

// Configura las rutas de egresados sin el prefijo /api
app.use('/', egresadosRoutes); // Cambia esto si es necesario

// Prueba la conexión a la base de datos y luego inicia el servidor
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
