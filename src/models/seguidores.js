// models/seguimiento.js
module.exports = (sequelize, DataTypes) => {
    const Seguimiento = sequelize.define('Seguimiento', {
      id_seguidores: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios', // Nombre de la tabla de usuarios
          key: 'id', // Campo que es clave primaria en la tabla de usuarios
        },
      },
      id_perfil_a_seguir: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios', // Nombre de la tabla de usuarios
          key: 'id', // Campo que es clave primaria en la tabla de usuarios
        },
      },
      fecha_seguimiento: {
        type: DataTypes.TIMESTAMP,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Fecha actual por defecto
      },
    }, {
      tableName: 'seguimientos', // Nombre de la tabla en la base de datos
      timestamps: false, // La fecha de creación y actualización no se manejarán automáticamente
    });
  
    // Relaciones (si son necesarias)
    Seguimiento.associate = (models) => {
      // Un seguimiento está asociado a un usuario (seguidor)
      Seguimiento.belongsTo(models.Usuario, {
        foreignKey: 'id_usuario',
        as: 'usuario', // Nombre de la relación (usuario que sigue)
      });
      // Un seguimiento está asociado a un perfil (usuario seguido)
      Seguimiento.belongsTo(models.Usuario, {
        foreignKey: 'id_perfil_a_seguir',
        as: 'perfilSeguido', // Nombre de la relación (usuario seguido)
      });
    };
  
    return Seguimiento;
  };
  