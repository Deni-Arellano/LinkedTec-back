const express = require('express');
const sequelize = require('./config/database');
const docentesRoutes = require('./routes/routes_docentes'); // Asegúrate de que la ruta sea correcta

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
