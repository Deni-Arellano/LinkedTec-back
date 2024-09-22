const express = require('express');
const sequelize = require('./config/database');
const docentesRoutes = require('./routes/routes_docentes'); 

const app = express();
const port = 3000;

const sequelize = require('./config/database'); 
const docenteRoutes = require('./routes/routes_docentes');

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

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
