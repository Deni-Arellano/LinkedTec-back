const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajusta la ruta según tu estructura de carpetas
const Usuario = require('./usuarios'); // Asegúrate de importar el modelo Usuario

class Docente extends Model {}

Docente.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ultimo_nivel_estudios: {
        type: DataTypes.ENUM('Licenciatura', 'Maestría', 'Doctorado'),
        allowNull: false
    },
    numero_empleado: {
        type: DataTypes.STRING(10),
        unique: true,
        allowNull: false
    },
    academia: {
        type: DataTypes.ENUM('IE', 'ISC', 'II', 'IA', 'CP', 'IGE'),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Docente',
    tableName: 'Docentes', // Para asegurarnos de que esté usando el nombre correcto de la tabla
    timestamps: false // Desactiva las marcas de tiempo
});

// Definir la asociación
Docente.belongsTo(Usuario, { foreignKey: 'id', targetKey: 'id' }); // Mapeo de 'id' de Docente a 'id' de Usuario

module.exports = Docente;