const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');

class Estudiante extends Model {}

Estudiante.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    no_control: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    carrera: {
        type: DataTypes.STRING,
        allowNull: false
    },
    semestre: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // No se incluye id_usuario
}, {
    sequelize,
    modelName: 'Estudiante',
    timestamps: false
});

// Definir la asociación
Estudiante.belongsTo(Usuario, { foreignKey: 'id', targetKey: 'id' }); // Usar 'id' como clave foránea

module.exports = Estudiante;
