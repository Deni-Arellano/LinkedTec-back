// src/models/egresados.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Modelo de datos de Egresado
 */
class Egresado extends Model {}

/**
 * Inicialización del modelo de Egresado.
 * Definición de los atributos del egresado, tales como ID, carrera, año de graduación y puesto.
 */
Egresado.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  carrera: {
    type: DataTypes.ENUM('IE', 'ISC', 'II', 'IA', 'CP', 'IGE'),
  },
  año_graduacion: {
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
