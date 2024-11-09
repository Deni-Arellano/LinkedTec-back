const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');

class Notificaciones extends Model {}

Notificaciones.init({
  id_notificacion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id_notificacion'
  },
  tipo: {
    type: DataTypes.ENUM(
      'empleo', 
      'noticia', 
      'postulacion', 
      'me_gusta'
    ),
    allowNull: false
  },
  id_referencia_tipo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  id_creador: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Notificaciones',
  tableName: 'notificaciones',
  timestamps: false
});


Notificaciones.belongsTo(Usuario, { as: 'creador', foreignKey: 'id_creador' });

module.exports = Notificaciones;

