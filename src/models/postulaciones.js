const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');
const Evento = require('./eventos');

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
      model: Evento,
      key: 'id_evento',
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
  id_estado: {  // Nueva columna para el estado
    type: DataTypes.INTEGER,
    references: {
      model: 'estados', 
      key: 'id_estado',
    },
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'postulacion',
  tableName: 'postulacion',
  timestamps: false,
});

Postulacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Postulacion.belongsTo(Evento, { foreignKey: 'id_empleo' });

module.exports = Postulacion;
