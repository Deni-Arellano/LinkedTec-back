const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios'); // Asegúrate de tener el modelo de Usuario importado

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
    },
    id_usuario: { // Nueva columna para la relación
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario, // Hace referencia al modelo Usuario
            key: 'id', // Llave primaria de la tabla usuario
        },
        onDelete: 'CASCADE', // Establece la relación con ON DELETE CASCADE
    }
}, {
    sequelize,
    modelName: 'Evento',
    tableName: 'evento',
    timestamps: false,
});

// Definición de la relación
Evento.belongsTo(Usuario, { foreignKey: 'id_usuario', onDelete: 'CASCADE' });

module.exports = Evento;
