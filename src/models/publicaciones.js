const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const Usuario = require('./usuarios'); 

// Define el modelo de Publicación
const Publicacion = sequelize.define('Publicacion', {
  id_publicacion: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true, 
    allowNull: false 
  },
  texto: {
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  imagen: {
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: true 
  },
  id_usuario: {
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: {
      model: 'Usuarios', // Referencia al modelo 'Usuarios'
      key: 'id' // La clave en el modelo 'Usuarios'
    }
  },
  me_gusta: {
    type: DataTypes.INTEGER, 
    defaultValue: 0
  },
  disgusta: {
    type: DataTypes.INTEGER,
    defaultValue: 0 
  }
}, {
  tableName: 'publicaciones', // Nombre de la tabla en la base de datos
  modelName: 'Publicacion', // Nombre del modelo
  timestamps: false // Desactiva los timestamps automáticos
});

// Exporta el modelo para su uso en otras partes de la aplicación
module.exports = Publicacion;
