const { crearPublicacionService, obtenerTodasLasPublicacionesService, obtenerPublicacionesPorUsuarioService, obtenerPublicacionPorIdService } = require('../services/services_publicaciones');

const crearPublicacion = async (req, res) => {
  try {
    const nuevaPublicacion = await crearPublicacionService(req.body);
    res.status(201).json(nuevaPublicacion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la publicación' });
  }
};

const obtenerPublicacionesPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const publicaciones = await obtenerPublicacionesPorUsuarioService(id_usuario);
    res.status(200).json(publicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las publicaciones del usuario' });
  }
};

const obtenerPublicacionPorId = async (req, res) => {
  try {
    const { id_publicacion } = req.params;
    const publicacion = await obtenerPublicacionPorIdService(id_publicacion);
    res.status(200).json(publicacion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener la publicación' });
  }
};

// Cambiar aquí
const obtenerTodasLasPublicaciones = async (req, res) => {
  try {
    const publicaciones = await obtenerTodasLasPublicacionesService(); // Llama al servicio adecuado
    res.status(200).json(publicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las publicaciones' });
  }
};

module.exports = {
  crearPublicacion,
  obtenerPublicacionesPorUsuario,
  obtenerPublicacionPorId,
  obtenerTodasLasPublicaciones
};
