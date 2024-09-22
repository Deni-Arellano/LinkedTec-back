const express = require('express');
const app = express();
require('dotenv').config();
const sequelize = require('./config/database');
const port = 3000;
const comentariosRoutes = require('./routes/routes_comentarios');
const reclutadoresRoutes = require('./routes/routes_reclutadores'); 
const egresadosRoutes = require('./routes/routes_egresados');
const empleosRoutes = require('./routes/routes_empleos');
const routesDocentes = require('./routes/routes_docentes'); // Importa las rutas de docentes
const routesEstudiantes = require('./routes/routes_estudiantes'); // Importa las rutas de estudiantes



app.use(express.json());



app.use('/publicaciones/comentarios', comentariosRoutes);
app.use('/usuarios/reclutadores', reclutadoresRoutes);

app.use('/usuarios/egresados', egresadosRoutes);
app.use('/empleos', empleosRoutes);

app.use('/api/docentes', routesDocentes);
app.use('/api/estudiantes', routesEstudiantes);





// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola, Mundo!');
});


sequelize.sync()
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