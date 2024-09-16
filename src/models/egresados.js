// src/models/egresados.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Egresado extends Model {}

Egresado.init({
  id_usuario: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Usuarios',
      key: 'id_usuario'
    },
    primaryKey: true,
  },
  telefono: {
    type: DataTypes.STRING(20),
  },
  sexo: {
    type: DataTypes.STRING(10),
  },
  fecha_nacimiento: {
    type: DataTypes.STRING,
  },
  biografia: {
    type: DataTypes.TEXT,
  },
  carrera: {
    type: DataTypes.STRING(255),
  },
  ano_graduacion: {
    type: DataTypes.STRING,
  },
  puesto: {
    type: DataTypes.STRING(255),
  },
}, {
  sequelize,
  modelName: 'Egresado',
  tableName: 'egresados',
  timestamps: false,
});

module.exports = Egresado;
  