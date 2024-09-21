// src/index.js
const express = require('express');
const sequelize = require('./config/database');

const comentariosRoutes = require('./routes/routes_comentarios'); // Ajusta la ruta aquí
const reclutadoresRoutes = require('./routes/routes_reclutadores'); // Ajusta la ruta aquí

require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/publicaciones/comentarios', comentariosRoutes);

app.use('/usuarios/reclutadores', reclutadoresRoutes);

app.use(express.json());

// Define el puerto en el que el servidor escuchará
const PORT = process.env.PORT || 3000;

// Configura una ruta que responde con "Hola, Mundo"
app.get('/', (req, res) => {
  res.send('Hola, Mundo!');
});


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
