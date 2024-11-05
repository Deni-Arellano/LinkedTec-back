const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const Usuario = require('../models/usuarios');

class Mensaje extends Model {}

Mensaje.init({
  id: { 
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_remitente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id', // Asegúrate de que este sea el campo correcto en el modelo Usuario
    },
    onDelete: 'CASCADE',
  },
  id_destinatario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id', // Asegúrate de que este sea el campo correcto en el modelo Usuario
    },
    onDelete: 'CASCADE',
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha_envio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  sequelize,
  modelName: 'Mensaje',
  tableName: 'mensajes',
  timestamps: false
});

// Ajuste de las asociaciones para que sean correctas
Mensaje.belongsTo(Usuario, { foreignKey: 'id_remitente', as: 'remitente' });
Mensaje.belongsTo(Usuario, { foreignKey: 'id_destinatario', as: 'destinatario' });

module.exports = Mensaje;
