const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Conexión a la base de datos
const Usuario = require('../models/usuarios');


class Mensaje extends Model {}

Mensaje.init({
  id: { // Cambia el nombre del campo a 'id' para coincidir con la tabla
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
    type: DataTypes.DATE, // Cambia de TIMESTAMP a DATE
    defaultValue: DataTypes.NOW, // La fecha y hora se autogeneran al guardar
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'mensaje',
  tableName: 'mensajes', 
  timestamps: false, 
});

// Relacionar el mensaje con el remitente y destinatario
Mensaje.belongsTo(Usuario, { as: 'remitente', foreignKey: 'id_remitente' });
Mensaje.belongsTo(Usuario, { as: 'destinatario', foreignKey: 'id_destinatario' });

module.exports = Mensaje;
