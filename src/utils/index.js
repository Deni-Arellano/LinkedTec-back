const express = require('express');
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
