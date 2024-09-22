const Comentario = require('../models/comentarios'); // Asegúrate de que este modelo esté correctamente definido y exportado

const obtenerComentarios = async (req, res) => {
  try {
    const comentarios = await Comentario.findAll();
    res.status(200).json(comentarios);
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({ message: 'Error al obtener comentarios', error });
  }
};

const crearComentario = async (req, res) => {
  const { texto, fecha, id_usuario, id_publicacion } = req.body;

  try {
    const nuevoComentario = await Comentario.create({
      texto,
      fecha,
      id_usuario,
      id_publicacion
    });
    res.status(201).json(nuevoComentario);
  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({ message: 'Error al crear comentario', error });
  }
};

const eliminarComentario = async (req, res) => {
  const { id } = req.params;

  try {
    const comentario = await Comentario.destroy({ where: { id_comentario: id } });
    if (comentario) {
      res.status(200).json({ message: 'Comentario eliminado' });
    } else {
      res.status(404).json({ message: 'Comentario no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    res.status(500).json({ message: 'Error al eliminar comentario', error });
  }
};

module.exports = {
  obtenerComentarios,
  crearComentario,
  eliminarComentario
};
