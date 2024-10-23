const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');
const Evento = require('./eventos');
// Importar el modelo de Estado
const Estado = require('./estados'); // Asegúrate de que la ruta sea correcta




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
      key: 'id_usuario',
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
  id_estado: {  // Columna para el estado
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Estado,
      key: 'id_estado',
    },
  },
  cv: {
    type: DataTypes.INTEGER, // Cambiado a INTEGER para que coincida con la definición de la tabla
    allowNull: true,
  },
  fecha_postulacion: {  // Columna para la fecha de la postulación
    type: DataTypes.DATE, // Usar tipo DATE para almacenar la fecha
    allowNull: false,
    defaultValue: DataTypes.NOW, // Establecer la fecha y hora actuales como valor por defecto
  },
}, {
  sequelize,
  modelName: 'postulacion',
  tableName: 'postulacion',
  timestamps: false, // Desactivado ya que vamos a usar 'fecha_postulacion'
});

// Definir las relaciones
Postulacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Postulacion.belongsTo(Empleo, { foreignKey: 'id_empleo' });
Postulacion.belongsTo(Estado, { foreignKey: 'id_estado' });

module.exports = Postulacion;