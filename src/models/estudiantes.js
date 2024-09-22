const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Estudiante = sequelize.define('Estudiante', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    no_control: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true, // Cambia a true para que no se repita
    },
    carrera: {
        type: DataTypes.ENUM('IE', 'ISC', 'II', 'IA', 'CP', 'IGE'),
        allowNull: false,
    },
    semestre: {
        type: DataTypes.ENUM('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'),
        allowNull: false,
    },
}, {
    tableName: 'estudiantes',
    timestamps: false, // Cambia a true si deseas incluir createdAt y updatedAt
});

module.exports = Estudiante;
