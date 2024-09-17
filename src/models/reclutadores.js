const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Reclutador extends Model {}

Reclutador.init({
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  sexo: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  nombre_empresa: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  fecha_fundacion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  sector_comercial: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'reclutador',
  tableName: 'reclutadores',
  timestamps: false,
});


module.exports = Reclutador;
