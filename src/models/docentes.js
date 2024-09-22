const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Docente extends Model {}

Docente.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true // Asegúrate de que esté configurado
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
    timestamps: false
});

// Definir la asociación
Docente.associate = (models) => {
    Docente.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
};

module.exports = Docente;
