const express = require('express');
<<<<<<< HEAD
const sequelize = require('./config/database');
const docentesRoutes = require('./routes/routes_docentes'); // Asegúrate de que la ruta sea correcta

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hola, Mundo!');
});

// Asegúrate de que la ruta de docentes esté correctamente configurada
app.use('/', docentesRoutes);

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
=======
const app = express();
const port = 3000;

const sequelize = require('./config/database'); // Cambiado a la ruta correcta
const docenteRoutes = require('./routes/routes_docentes');

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Usar las rutas para /api/docentes
app.use('/api/docentes', docenteRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola, Mundo!');
});


// Conectar a la base de datos y arrancar el servidor
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos exitosa.');
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });
>>>>>>> 4a821861ab694e0a2a71d467ad6aa804d8891410
