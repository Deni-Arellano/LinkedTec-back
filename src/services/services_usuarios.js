const Usuario = require('../models/usuarios'); 

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
 * Obtiene un usuario por su ID.
 * @param {number} id - ID del usuario a obtener.
 * @returns {Promise<Object>} - Promesa que resuelve con el usuario encontrado.
 * @throws {Error} - Lanza un error si el usuario no se encuentra o si hay un problema al buscarlo.
 */
const obtenerUsuarioPorId = async (id) => {
<<<<<<< HEAD
    try {
<<<<<<< HEAD
      const usuario = await Usuario.findByPk(id); 
=======
      const usuario = await Usuario.findByPk(id);
>>>>>>> MigueRosales
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      return usuario;
    } catch (error) {
      throw new Error('Error al obtener el usuario: ' + error.message);
    }
  };
  

const obtenerTodosLosUsuarios = async () => {
    try {
        const usuarios = await Usuario.findAll();
        return usuarios;
    } catch (error) {
        throw new Error('Error al obtener los usuarios: ' + error.message);
=======
  try {
    const usuario = await Usuario.findByPk(id); // Busca el usuario por su ID
    if (!usuario) {
      throw new Error('Usuario no encontrado'); // Lanza un error si el usuario no existe
>>>>>>> louis-alamoD
    }
    return usuario; // Retorna el usuario encontrado
  } catch (error) {
    // Manejo de errores
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

// Exporta las funciones para usarlas en otras partes de la aplicación
module.exports = {
  crearUsuario,
  obtenerUsuarioPorId,
  obtenerTodosLosUsuarios
};
