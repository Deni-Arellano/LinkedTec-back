const express = require('express');
const sequelize = require('./config/database');
const egresadosRoutes = require('./routes/routes_egresados');
const empleosRoutes = require('./routes/routes_empleos');
require('dotenv').config();

const app = express();

app.use(express.json());
print("Hola Ariel")
app.use('/usuarios/egresados', egresadosRoutes);
app.use('/empleos', empleosRoutes);

app.get('/', (req, res) => {
  res.send('Hola, Mundo!');
});

const PORT = process.env.PORT || 3000;

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
