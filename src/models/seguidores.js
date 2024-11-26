const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios'); 

const Seguimiento = sequelize.define('Seguimiento', {
  id_seguidores: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
  id_perfil_a_seguir: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
  fecha_seguimiento: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'seguimientos',
  timestamps: false,
});
Seguimiento.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
Seguimiento.belongsTo(Usuario, { foreignKey: 'id_perfil_a_seguir', as: 'perfilSeguido' });

module.exports=Seguimiento;

