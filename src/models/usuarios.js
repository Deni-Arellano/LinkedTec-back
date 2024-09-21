const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

class Usuario extends Model {}

Usuario.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido_paterno: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido_materno: {
    type: DataTypes.STRING,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
  },
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
