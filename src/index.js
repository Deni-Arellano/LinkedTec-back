const express = require('express');
const sequelize = require('./config/database');
const routes = require('./routes/routes_docentes'); // Asegúrate de que la ruta sea correcta
const Usuario = require('./models/usuarios');
const Docente = require('./models/docentes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(routes);

app.get('/', (req, res) => {
    res.send('¡Hola, Mundo!');
});

// Define las asociaciones
Usuario.hasOne(Docente, { foreignKey: 'id' });
Docente.belongsTo(Usuario, { foreignKey: 'id' });

sequelize.sync({ force: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error al sincronizar la base de datos:', error);
    });
