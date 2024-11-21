const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./usuarios');  // Ajusta la ruta si es necesario

class Reporte extends Model {}

Reporte.init({
    id_reporte: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tipo_reporte: {
        type: DataTypes.ENUM('acoso', 'amenaza', 'discriminación', 'difamación', 'ofensa', 'suplantación de identidad', 'fraude', 'otros'),
        allowNull: false,
    },
    categoria_reporte: {
        type: DataTypes.ENUM('perfil', 'publicaciones', 'noticias', 'empleos', 'foros', 'eventos', 'otros'),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    fecha_reporte: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    id_elemento_reportado: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    titulo_reporte: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM('Atendido', 'En espera', 'Pendiente'),
        allowNull: false,
        defaultValue: 'Pendiente',
    }
}, {
    sequelize,
    modelName: 'Reporte',
    tableName: 'reportes',
    timestamps: false,
});

Reporte.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

module.exports = Reporte;
