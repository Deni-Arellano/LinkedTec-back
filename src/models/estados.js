const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Estado extends Model {}

Estado.init({
  id_estado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false, // No permitir valores nulos
  },
  estado: {
    type: DataTypes.STRING(50),
    allowNull: false, // No permitir valores nulos
  },
}, {
  sequelize,
  modelName: 'estado',
  tableName: 'estados',
  timestamps: false, // No utilizar 'createdAt' y 'updatedAt'
});

// Exportar el modelo
module.exports = Estado;
