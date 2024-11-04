const Usuario = require('../models/usuarios');
const sequelize = require('../config/database'); // Asegúrate de importar sequelize desde tus modelos
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
    const usuario = await Usuario.create(usuarioData); // Crea el usuario en la base de datos
    return usuario; // Retorna el usuario creado
  } catch (error) {
    // Manejo de errores
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
    // Primero, obtenemos la información básica del usuario
    const [usuario] = await sequelize.query(
      `SELECT * FROM usuarios WHERE id = :id`, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Dependiendo del rol, hacemos una consulta adicional
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
        // Si es un egresado o cualquier otro rol no especificado
        infoAdicional = await sequelize.query(
          `SELECT * FROM egresados WHERE id = :id`, {
          replacements: { id },
          type: sequelize.QueryTypes.SELECT
        });
    }

    // Combinamos la información del usuario con la información adicional
    const resultadoFinal = {
      ...usuario,
      ...infoAdicional[0] // Asegúrate de obtener el primer elemento del array si es necesario
    };

    return resultadoFinal; // Retorna el objeto combinado
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
    const usuarios = await Usuario.findAll(); // Obtiene todos los usuarios de la base de datos
    return usuarios; // Retorna la lista de usuarios
  } catch (error) {
    // Manejo de errores
    throw new Error('Error al obtener los usuarios: ' + error.message);
  }
};

const deleteUsuario = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
      throw new Error('Usuario no encontrado');
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


// Exporta las funciones para usarlas en otras partes de la aplicación
module.exports = {
  crearUsuario,
  obtenerUsuarioPorId,
  obtenerTodosLosUsuarios,
  deleteUsuario
};