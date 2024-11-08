// controllers/reaccion_controller.js

const { actualizarReaccion } = require('../services/services_reaccion');
const Publicacion = require('../models/publicaciones');
const Usuario = require('../models/usuarios'); // Importa el modelo de Usuario

const reaccionar = async (req, res, wssReacciones) => {
  try {
    const { id_publicacion, tipo_reaccion, cancelar, id_usuario } = req.body;

    // Validar el tipo de reacción
    if (tipo_reaccion !== 'me_gusta' && tipo_reaccion !== 'disgusta') {
      return res.status(400).json({ error: "Tipo de reacción no válido" });
    }

    // Validar si la publicación existe
    const publicacion = await Publicacion.findByPk(id_publicacion);
    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    // Validar si el usuario existe
    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Llamar al servicio para actualizar la reacción
    const resultado = await actualizarReaccion(id_publicacion, tipo_reaccion, cancelar, wssReacciones, id_usuario);

    return res.status(200).json({ message: "Reacción procesada correctamente", publicacion: resultado });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  reaccionar
};
