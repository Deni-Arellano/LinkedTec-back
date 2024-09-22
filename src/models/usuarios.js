// Importa las dependencias necesarias
const { Model, DataTypes } = require('sequelize'); 
const sequelize = require('../config/database'); 

// Define la clase Usuario que extiende Model de Sequelize
class Usuario extends Model {}

// Inicializa el modelo Usuario
Usuario.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true, // Se incrementa automáticamente
    primaryKey: true, // Este campo es la clave primaria
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
    unique: true, // Debe ser único en la base de datos
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
    type: DataTypes.ENUM('Masculino', 'Femenino', 'Otro'), // Tipo de dato para el sexo con opciones limitadas
  },
  biografia: {
    type: DataTypes.TEXT, 
  },
  role: {
    type: DataTypes.ENUM('Estudiante', 'Maestro', 'Empleador', 'Empresa', 'Egresado'), // Tipo de dato para el rol con opciones limitadas
    allowNull: false, 
  },
  imagen_usuario: {
    type: DataTypes.STRING, // Tipo de dato para la imagen de usuario
  },
}, {
  sequelize, // Pasar la instancia de Sequelize
  modelName: 'Usuario', // Nombre del modelo
  tableName: 'usuarios', // Nombre de la tabla en la base de datos
  timestamps: false, // Desactiva los campos de timestamps (createdAt, updatedAt)
});

// Exporta el modelo para su uso en otras partes de la aplicación
module.exports = Usuario;
