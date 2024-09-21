const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajusta la ruta según tu estructura de carpetas

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
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Docente',
    timestamps: false // Desactiva las marcas de tiempo
});

// Aquí puedes definir las asociaciones, si es necesario
// Docente.associate = (models) => {
//     Docente.belongsTo(models.Usuario, { foreignKey: 'id_usuario' });
// };

module.exports = Docente;
