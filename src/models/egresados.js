// src/models/egresados.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Egresados = sequelize.define('Egresados', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  sexo: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  fecha_nacimiento: {
    type: DataTypes.DATE,
    allowNull: false
  },
  biografia: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  carrera: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ano_graduacion: {
    type: DataTypes.INTEGER, // Cambiar de year a integer
    allowNull: false
  },
  puesto: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'egresados',
  timestamps: false // Si no estás usando timestamps en tu tabla
});

module.exports = Egresados;
