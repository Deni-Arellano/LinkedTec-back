<<<<<<< HEAD
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

class Usuario extends Model {}

Usuario.init({
  id: {
=======
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
>>>>>>> Jony
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido_paterno: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido_materno: {
    type: DataTypes.STRING,
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false
  },
<<<<<<< HEAD
  fecha_nacimiento: {
    type: DataTypes.DATE,
  },
  telefono: {
    type: DataTypes.STRING(20),
  },
  sexo: {
    type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'),
  },
  biografia: {
    type: DataTypes.TEXT,
  },
  role: {
    type: DataTypes.ENUM('Estudiante', 'Maestro', 'Empleador', 'Empresa', 'Egresado'),
    allowNull: false,
  },
  imagen_usuario: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'Usuario',
  tableName: 'usuarios', 
  timestamps: false,
});


module.exports = Usuario;
=======
  tipo_usuario: {
    type: DataTypes.ENUM('egresado', 'reclutador', 'estudiante', 'docente'),
    allowNull: false
  }
}, {
  timestamps: false // Desactivar las columnas createdAt y updatedAt
});

module.exports = { Usuario };
>>>>>>> Jony
