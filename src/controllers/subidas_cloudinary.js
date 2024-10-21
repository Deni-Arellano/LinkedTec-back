const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class SubidasCloudinary extends Model {}

SubidasCloudinary.init({
    id: { 
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_recurso: {
        type: DataTypes.STRING(255),
        allowNull: false, 
    },
    id_publico: {
        type: DataTypes.STRING(255),
        allowNull: false,  
    },
    formato: {
        type: DataTypes.STRING(50),  
    },
    tipo_recurso: {
        type: DataTypes.STRING(50), 
    },
    fecha_creacion: {
        type: DataTypes.DATE,  
    },
    url_segura: {
        type: DataTypes.STRING(500),  
    },
    carpeta: {
        type: DataTypes.STRING(255),  
    },
    nombre_original: {
        type: DataTypes.STRING(255),  
    },
    tipo_subida: {
        type: DataTypes.ENUM('imagen', 'archivo'), 
    },
}, {
    sequelize,
    modelName: 'SubidasCloudinary',
    tableName: 'subidas_cloudinary',
    timestamps: false,
});

module.exports = SubidasCloudinary;
