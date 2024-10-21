const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');
const Evento = require('./eventos'); // Modelo correspondiente a la tabla 'evento'

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
      model: Usuario, // Hace referencia a la tabla 'usuarios'
      key: 'id',
    },
    onDelete: 'CASCADE', // Elimina las postulaciones si el usuario es eliminado
  },
  id_empleo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Evento, // Hace referencia a la tabla 'evento'
      key: 'id_evento',
    },
    onDelete: 'CASCADE', // Elimina las postulaciones si el evento es eliminado
  },
  descripcion_personal: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  cv: {
    type: DataTypes.STRING(255), // Campo para almacenar la URL del CV
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'postulacion',
  tableName: 'postulacion',
  timestamps: false, // No utilizar 'createdAt' y 'updatedAt'
});

// Definir relaciones (opcional, para acceso más sencillo)
Postulacion.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Postulacion.belongsTo(Evento, { foreignKey: 'id_empleo' });

module.exports = Postulacion;
