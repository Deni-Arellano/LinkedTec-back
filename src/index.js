const express = require('express');
const sequelize = require('./config/database');
const routesDocentes = require('./routes/routes_docentes'); // Importa las rutas de docentes
const routesEstudiantes = require('./routes/routes_estudiantes'); // Importa las rutas de estudiantes

const app = express();
const port = 3000;


app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola, Mundo!');
});

// Usa las rutas importadas
app.use('/api/docentes', routesDocentes);
app.use('/api/estudiantes', routesEstudiantes);

// Conectar a la base de datos y arrancar el servidor
sequelize.sync() // Sincroniza los modelos con la base de datos
  .then(() => {
    console.log('Modelos sincronizados exitosamente.');
    return sequelize.authenticate(); // Autenticarse después de sincronizar
  })
  .then(() => {
    console.log('Conexión a la base de datos exitosa.');
    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos o sincronizar los modelos:', err);
  });
