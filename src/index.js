const express = require('express');
const sequelize = require('./config/database');
const routesDocentes = require('./routes/routes_docentes');
const routesEstudiantes = require('./routes/routes_estudiantes');
const Usuario = require('./models/usuarios');
const Docente = require('./models/docentes');
const Estudiante = require('./models/estudiantes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(routesDocentes);
app.use(routesEstudiantes); // Asegúrate de incluir las rutas de estudiantes

app.get('/', (req, res) => {
    res.send('¡Hola, Mundo!');
});

// Define las asociaciones
Usuario.hasOne(Docente, { foreignKey: 'id' });
Docente.belongsTo(Usuario, { foreignKey: 'id' });

Usuario.hasOne(Estudiante, { foreignKey: 'id' });
Estudiante.belongsTo(Usuario, { foreignKey: 'id' });

sequelize.sync({ force: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error al sincronizar la base de datos:', error);
    });
