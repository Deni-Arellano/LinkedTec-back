const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Docente = sequelize.define('Docente', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'Usuario',
      key: 'id_usuario'
    }
  },
  fecha_nacimiento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  biografia: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  ultimo_nivel_estudios: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  numero_empleado: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  rh: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  academia: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  timestamps: false // Desactivar las columnas createdAt y updatedAt
});


module.exports = { Docente };
