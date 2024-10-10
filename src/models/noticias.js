const{Model,DataTypes}=require('sequelize');
const sequelize=require('../config/database');

/**
 * Modelo de datos de Noticias
 */

class Noticia extends Model{}

/**
 * Inicialización del modelo de Noticias.
 * Definición de los atributos de la noticia, tales como ID, título, contenido, fecha de publicación y autor.
 */

Noticia.init({
    id_noticia:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    titulo_noticia: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true, 
        }
      },      
    imagen_noticia:{
        type:DataTypes.STRING(255),
        allowNull:true,
    },
    enlace_noticia:{
        type:DataTypes.STRING(255),
        allowNull:true,
    },
    fecha_noticia:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW,
        allowNull:false,
    },
    categoria_noticia:{
        type:DataTypes.ENUM('IE','ISC','II','IA','CP','IGE'),
        allowNull:false,
    },
    id_usuario:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
},{
    sequelize,
    modelName:'Noticia',
    tableName:'noticias',
    timestamps:false,
});

module.exports=Noticia;