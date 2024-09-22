// src/models/usuarios.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido_paterno: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido_materno: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sexo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    biografia: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imagen_usuario: { // Nueva columna añadida
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    tableName: 'usuarios',
    timestamps: false, // Esto incluye createdAt y updatedAt, si no lo deseas, cámbialo a false
});

// Aquí puedes definir las asociaciones, si las hay

module.exports = Usuario;
