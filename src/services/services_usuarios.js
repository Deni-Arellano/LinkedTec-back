// services/usuarioService.js
const Usuario = require('../models/usuarios');

const crearUsuario = async (usuarioData) => {
  try {
    const usuario = await Usuario.create(usuarioData);
    return usuario;
  } catch (error) {
    throw new Error('Error al crear el usuario: ' + error.message);
  }
};


const obtenerUsuarioPorId = async (id) => {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }
      return usuario;
    } catch (error) {
      throw new Error('Error al obtener el usuario: ' + error.message);
    }
  };
  
  module.exports = {
    crearUsuario,
    obtenerUsuarioPorId
  };