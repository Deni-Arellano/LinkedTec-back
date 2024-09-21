// src/models/egresados.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Egresado extends Model {}

Egresado.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  carrera: {
    type: DataTypes.ENUM('IE', 'ISC', 'II', 'IA', 'CP', 'IGE'),
  },
  ano_graduacion: {
    type: DataTypes.INTEGER,
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
