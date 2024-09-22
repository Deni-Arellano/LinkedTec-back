<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const { Model, DataTypes } = require('sequelize');
=======
// Importa las dependencias necesarias
const { Model, DataTypes } = require('sequelize'); 
>>>>>>> louis-alamo
const sequelize = require('../config/database'); 

// Define la clase Usuario que extiende Model de Sequelize
class Usuario extends Model {}

// Inicializa el modelo Usuario
Usuario.init({
  id: {
=======
=======
// src/models/usuarios.js

>>>>>>> Jony
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
<<<<<<< HEAD
  id_usuario: {
>>>>>>> Jony
    type: DataTypes.INTEGER,
<<<<<<< HEAD
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
=======
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
>>>>>>> louis-alamo
  },
<<<<<<< HEAD
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

<<<<<<< HEAD

module.exports = Usuario;
=======
  tipo_usuario: {
    type: DataTypes.ENUM('egresado', 'reclutador', 'estudiante', 'docente'),
    allowNull: false
  }
=======
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        allowNull: false,
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
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sexo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    biografia: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imagen_usuario: { // Nueva columna añadida
        type: DataTypes.STRING(255),
        allowNull: true,
    },
>>>>>>> Jony
}, {
    tableName: 'usuarios',
    timestamps: false, // Esto incluye createdAt y updatedAt, si no lo deseas, cámbialo a false
});

<<<<<<< HEAD
module.exports = { Usuario };
>>>>>>> Jony
=======
// Exporta el modelo para su uso en otras partes de la aplicación
module.exports = Usuario;
>>>>>>> louis-alamo
=======
// Aquí puedes definir las asociaciones, si las hay

module.exports = Usuario;
>>>>>>> Jony
