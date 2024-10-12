const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Evento extends Model {}

Evento.init({
    id_evento: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    lugar: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    enlace: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    imagen: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    tipo_evento: {
        type: DataTypes.ENUM('taller', 'seminario', 'evento general'),
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'evento',
    tableName: 'evento',
    timestamps: false,
});

module.exports = Evento;
