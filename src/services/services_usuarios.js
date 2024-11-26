const Usuario = require('../models/usuarios');
const sequelize = require('../config/database'); 
const Docente = require('../models/docentes');
const Estudiante = require('../models/estudiantes');
const Egresado = require('../models/egresados');
const Reclutador = require('../models/reclutadores');

/**
 * Crea un nuevo usuario en la base de datos.
 * @param {Object} usuarioData - Objeto que contiene los datos del usuario a crear.
 * @returns {Promise<Object>} - Promesa que resuelve con el usuario creado.
 * @throws {Error} - Lanza un error si no se puede crear el usuario.
 */
const crearUsuario = async (usuarioData) => {
  try {
    const usuario = await Usuario.create(usuarioData);
    return usuario; 
  } catch (error) {
    throw new Error('Error al crear el usuario: ' + error.message);
  }
};


/**
 * Obtiene un usuario por su ID y su información específica según el rol.
 * @param {number} id - ID del usuario a obtener.
 * @returns {Promise<Object>} - Promesa que resuelve con toda la información del usuario y su rol.
 * @throws {Error} - Lanza un error si el usuario no se encuentra o si hay un problema al buscarlo.
 */
const obtenerUsuarioPorId = async (id) => {
  try {
    const [usuario] = await sequelize.query(
      `SELECT * FROM usuarios WHERE id = :id`, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    let infoAdicional = {};
    switch (usuario.role) {
      case 'Egresados':
        infoAdicional = await sequelize.query(
          `SELECT * FROM egresados WHERE id = :id`, {
          replacements: { id },
          type: sequelize.QueryTypes.SELECT
        });
        break;
      case 'Estudiantes':
        infoAdicional = await sequelize.query(
          `SELECT * FROM estudiantes WHERE id = :id`, {
          replacements: { id },
          type: sequelize.QueryTypes.SELECT
        });
        break;
      case 'Docentes':
        infoAdicional = await sequelize.query(
          `SELECT * FROM docentes WHERE id = :id`, {
          replacements: { id },
          type: sequelize.QueryTypes.SELECT
        });
        break;
      case 'Reclutadores':
        infoAdicional = await sequelize.query(
          `SELECT * FROM reclutadores WHERE id = :id`, {
          replacements: { id },
          type: sequelize.QueryTypes.SELECT
        });
        break;
      default:
        infoAdicional = await sequelize.query(
          `SELECT * FROM egresados WHERE id = :id`, {
          replacements: { id },
          type: sequelize.QueryTypes.SELECT
        });
    }

    const resultadoFinal = {
      ...usuario,
      ...infoAdicional[0] 
    };

    return resultadoFinal; 
  } catch (error) {
    throw new Error('Error al obtener el usuario: ' + error.message);
  }
};


/**
 * Obtiene todos los usuarios de la base de datos.
 * @returns {Promise<Array>} - Promesa que resuelve con una lista de usuarios.
 * @throws {Error} - Lanza un error si hay un problema al obtener los usuarios.
 */
const obtenerTodosLosUsuarios = async () => {
  try {
    const usuarios = await Usuario.findAll(); 
    return usuarios; 
  } catch (error) {
    throw new Error('Error al obtener los usuarios: ' + error.message);
  }
};

const deleteUsuario = async (id, contraseñaRecibida) => {
  const usuario = await Usuario.findByPk(id);

  if (!usuario) {
      throw new Error('Usuario no encontrado');
  }


  if (usuario.contraseña != contraseñaRecibida) {
      throw new Error('Contraseña incorrecta, no se puede eliminar el usuario');
  }

  if (usuario.role === 'Docentes') {
      await Docente.destroy({ where: { id: usuario.id } });
  } else if (usuario.role === 'Estudiantes') {
      await Estudiante.destroy({ where: { id: usuario.id } });
  } else if (usuario.role === 'Egresados') {
      await Egresado.destroy({ where: { id: usuario.id } });
  } else if (usuario.role === 'Reclutadores') {
      await Reclutador.destroy({ where: { id: usuario.id } });
  } else {
      throw new Error('Rol no válido');
  }

  await Usuario.destroy({ where: { id: usuario.id } });

  return { message: `Usuario con ID ${id} y rol ${usuario.role} eliminado con éxito` };
};




const obtenerImagenUsuario = async (id) => {


  try {

    const imagen = await sequelize.query(
      `SELECT imagen_usuario FROM usuarios WHERE id = :id`, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT
    });
    return imagen;


  }catch (error) {
    throw new Error('Error al obtener la imagen del usuario: ' + error.message);
  }

};



const obtenerTotalUsuarios = async () => {
    try {
        const totalUsuarios = await Usuario.count();
        return totalUsuarios;
    } catch (error) {
        throw new Error('Error al obtener el total de usuarios: ' + error.message);
    }
}


const obtenerTotalUsuariosPorRol = async () => {

  try {

    const totalUsuariosPorRol = await sequelize.query(`
            SELECT role, COUNT(*) AS total
            FROM usuarios
            GROUP BY role;
        `);

        return totalUsuariosPorRol[0];


  }catch (error) {
    throw new Error('Error al obtener el total de usuarios por rol: ' + error.message);
  }
}


module.exports = {
  crearUsuario,
  obtenerUsuarioPorId,
  obtenerTodosLosUsuarios,
  obtenerImagenUsuario,
  deleteUsuario,
  obtenerTotalUsuarios,
  obtenerTotalUsuariosPorRol

};