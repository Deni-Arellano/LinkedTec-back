const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios'); 

class Reclutador extends Model {}

Reclutador.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Usuario, 
      key: 'id',
    },
    onDelete: 'CASCADE', 
  },
  nombre_empresa: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  sede: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  giro: {
    type: DataTypes.ENUM('Comercial', 'Servicio', 'Manufacturera', 'Agricultura'),
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'reclutador',
  tableName: 'reclutadores',
  timestamps: false,
});


Reclutador.belongsTo(Usuario, { foreignKey: 'id' });

module.exports = Reclutador;
