const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');  
const Evento = require('./eventos');    

class ConfirmacionAsistencia extends Model {}

ConfirmacionAsistencia.init({
    id: { // Añadir el campo id
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id',
        },
    },
    id_evento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Evento,
            key: 'id_evento',
        },
    },
}, {
    sequelize,
    modelName: 'confirmacion_asistencia',
    tableName: 'confirmacion_asistencia',
    timestamps: false,
});

ConfirmacionAsistencia.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
ConfirmacionAsistencia.belongsTo(Evento, { foreignKey: 'id_evento', as: 'evento' });

module.exports = ConfirmacionAsistencia;
