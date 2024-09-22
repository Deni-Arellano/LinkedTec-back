const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de ajustar la ruta de tu archivo de configuración

class Comentario extends Model {}

Comentario.init({
  id_comentario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  texto: {
    type: DataTypes.STRING(255),
  },
  fecha: {
    type: DataTypes.DATE,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
  },
  id_publicacion: {
    type: DataTypes.INTEGER,
  }
}, {
  sequelize,
  modelName: 'comentario',
  tableName: 'comentarios',
  timestamps: false 
});

module.exports = Comentario;