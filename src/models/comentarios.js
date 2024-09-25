const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');  // Asegúrate de que la ruta sea correcta

class Comentario extends Model {}

Comentario.init({
    id_comentario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_publicacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'comentario',
    tableName: 'comentarios', // Asegúrate de que la tabla esté correctamente nombrada
    timestamps: false,
});

Comentario.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

module.exports = Comentario;
