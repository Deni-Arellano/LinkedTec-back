const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');

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
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id',
        },
        onDelete: 'CASCADE',
    }
}, {
    sequelize,
    modelName: 'Evento',
    tableName: 'evento',
    timestamps: false,
});


Evento.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario', onDelete: 'CASCADE' });

module.exports = Evento;
