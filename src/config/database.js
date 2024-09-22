const { Sequelize } = require('sequelize');

<<<<<<< HEAD
const sequelize = new Sequelize('linked_tec', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql', // o el dialecto que estés usando
});

module.exports = sequelize; // Asegúrate de exportar la instancia
=======
const sequelize = new Sequelize('linkedtec', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
>>>>>>> 4a821861ab694e0a2a71d467ad6aa804d8891410
