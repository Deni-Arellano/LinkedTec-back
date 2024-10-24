const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');
const Empleo = require('./empleos');
const Estado = require('./estados');
const SubidasCloudinary = require('./subidas_cloudinary');

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
  id_estado: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Estado,
      key: 'id_estado',
    },
  },
  cv: {
    type: DataTypes.INTEGER, // Sigue siendo un INTEGER para representar la clave foránea a otro modelo (archivo subido).
    allowNull: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,  // Establece la fecha y hora actuales por defecto.
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'postulacion',
  tableName: 'postulacion',
  timestamps: false, // No utilizamos las columnas 'createdAt' y 'updatedAt' de Sequelize.
});

// Definir las relaciones
Postulacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Postulacion.belongsTo(Empleo, { foreignKey: 'id_empleo' });
Postulacion.belongsTo(Estado, { foreignKey: 'id_estado' });
Postulacion.belongsTo(SubidasCloudinary, { foreignKey: 'id_archivo'});


module.exports = Postulacion;
