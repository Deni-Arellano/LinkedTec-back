// models/ReaccionesUsuarios.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de tener la conexión de Sequelize correctamente configurada

const ReaccionesUsuarios = sequelize.define('ReaccionesUsuarios', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_publicacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Publicaciones',
      key: 'id'
    }
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios',
      key: 'id'
    }
  },
  tipo_reaccion: {
    type: DataTypes.ENUM('me_gusta', 'disgusta'),
    allowNull: false
  }
}, {
  tableName: 'ReaccionesUsuarios',
  timestamps: false
});

module.exports = ReaccionesUsuarios;
