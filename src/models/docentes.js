<<<<<<< HEAD
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Docente extends Model {}

Docente.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true // Asegúrate de que esté configurado
    },
    ultimo_nivel_estudios: {
        type: DataTypes.ENUM('Licenciatura', 'Maestría', 'Doctorado'),
        allowNull: false
    },
    numero_empleado: {
        type: DataTypes.STRING(10),
        unique: true,
        allowNull: false
    },
    academia: {
        type: DataTypes.ENUM('IE', 'ISC', 'II', 'IA', 'CP', 'IGE'),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Docente',
    timestamps: false
});

// Definir la asociación
Docente.associate = (models) => {
    Docente.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
};

module.exports = Docente;
=======
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
>>>>>>> 4a821861ab694e0a2a71d467ad6aa804d8891410
