const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios'); // Asegúrate de que el modelo Usuario esté importado

class Reclutador extends Model {}

Reclutador.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Usuario, // Hace referencia al modelo Usuario
      key: 'id',
    },
    onDelete: 'CASCADE', // Esto asegura que si un usuario es eliminado, el reclutador asociado también lo sea
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

// Relación entre Reclutador y Usuario
Reclutador.belongsTo(Usuario, { foreignKey: 'id' });

module.exports = Reclutador;
