const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');
const Empleo = require('./empleos');
const Estado = require('./estados');

class Postulacion extends Model {}

Postulacion.init({
  id_postulacion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  id_empleo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Empleo, 
      key: 'id_empleo',
    },
    onDelete: 'CASCADE',
  },
  descripcion_personal: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  cv: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  id_estado: {  // Columna para el estado
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Estado, // Cambiado para hacer referencia al modelo
      key: 'id_estado',
    },
  },
}, {
  sequelize,
  modelName: 'postulacion',
  tableName: 'postulacion',
  timestamps: false,
});

// Definir las relaciones
Postulacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Postulacion.belongsTo(Empleo, { foreignKey: 'id_empleo' });
Postulacion.belongsTo(Estado, { foreignKey: 'id_estado' });

module.exports = Postulacion;