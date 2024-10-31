const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('../models/usuarios');

class Notificacion extends Model {}

Notificacion.init({
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
      'postulacion_aceptada', 
      'postulacion_rechazada', 
      'like_publicacion', 
      'reporte_publicacion', 
      'reporte_noticia'
    ),
    allowNull: false
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  id_usuario_emisor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Usuario,
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  id_usuario_destinatario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Usuario,
      key: 'id'
    },
    onDelete: 'SET NULL'
  },
  id_referencia: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  visto: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Notificacion',
  tableName: 'notificaciones',
  timestamps: false
});

Notificacion.belongsTo(Usuario, { as: 'emisor', foreignKey: 'id_usuario_emisor' });
Notificacion.belongsTo(Usuario, { as: 'destinatario', foreignKey: 'id_usuario_destinatario' });

module.exports = Notificacion;
