const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('linked_tec', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql', // o el dialecto que estés usando
});

module.exports = sequelize; // Asegúrate de exportar la instancia
