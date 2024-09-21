const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('linked_tec', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql', // Cambia esto si usas otro dialecto
});

module.exports = sequelize;
