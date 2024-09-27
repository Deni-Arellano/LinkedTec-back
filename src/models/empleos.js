const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Modelo de datos de Empleo
 */
class Empleo extends Model {}

/**
 * Inicialización del modelo de Empleo.
 * Definición de los atributos del empleo, tales como ID, título, empresa, salario, descripción, ubicación y nivel de inglés.
 */
Empleo.init({
  id_empleo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  empresa: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  salario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ubicacion: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  nivel_de_ingles: {
    type: DataTypes.ENUM('Avanzado', 'Intermedio', 'Básico', 'No aplica'),
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Empleo',
  tableName: 'empleos',
  timestamps: false,
});

module.exports = Empleo;
