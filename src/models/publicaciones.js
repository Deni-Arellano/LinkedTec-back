const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const Usuario = require('./usuarios'); 

// Define el modelo de Publicación
const Publicacion = sequelize.define('Publicacion', {
  id_publicacion: {
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true, 
    allowNull: false 
  },
  descripcion: {
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  imagen: {
    type: DataTypes.STRING(255), 
    allowNull: true 
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: true 
  },
  id_usuario: {
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: {
      model: 'Usuarios', 
      key: 'id'
    }
  },
  me_gusta: {
    type: DataTypes.INTEGER, 
    defaultValue: 0
  },
  disgusta: {
    type: DataTypes.INTEGER,
    defaultValue: 0 
  }
}, {
  tableName: 'publicaciones',
  modelName: 'Publicacion',
  timestamps: false
});

Publicacion.belongsTo(Usuario, { foreignKey: 'id_usuario', targetKey: 'id' });
Publicacion.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });


module.exports = Publicacion;
