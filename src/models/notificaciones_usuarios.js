const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Notificaciones = require('./notificaciones');
const Usuario = require('../models/usuarios');

class NotificacionesUsuarios extends Model {}

NotificacionesUsuarios.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_notificacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Notificaciones,
      key: 'id_notificacion'
    }
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'NotificacionesUsuarios',
  tableName: 'notificaciones_usuarios',
  timestamps: false
});


NotificacionesUsuarios.belongsTo(Notificaciones, { foreignKey: 'id_notificacion', as : 'Notificaciones' });
NotificacionesUsuarios.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = NotificacionesUsuarios;