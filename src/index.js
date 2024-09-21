// src/index.js
const express = require('express');
const sequelize = require('./config/database');
const usuarioRoutes = require('./routes/routes_usuario');
const publicacionRoutes = require('./routes/routes_publicaciones');



require('dotenv').config();

const app = express();

app.use(express.json());

// Define el puerto en el que el servidor escuchará
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hola, Mundo!');
});


app.use('/usuarios', usuarioRoutes);
app.use('/publicaciones', publicacionRoutes);



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
