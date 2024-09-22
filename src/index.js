const express = require('express');
const app = express();
const sequelize = require('./config/database'); // Cambiado a la ruta correcta
const port = 3000;

app.use(express.json());



// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola, Mundo!');
});

// Conectar a la base de datos y arrancar el servidor
sequelize.sync() // Sincroniza los modelos con la base de datos
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