const Comentario = require('../models/comentarios'); // Asegúrate de que sea Comentario
const Usuario = require('../models/usuarios'); // Asegúrate de importar el modelo Usuario
const { obtenerComentariosPorPublicacion: obtenerComentariosPorPublicacionServicio } = require('../services/services_comentarios');

const obtenerComentarios = async (req, res) => {
    const { id } = req.params; // ID de la publicación

    try {
        const comentarios = await obtenerComentariosPorPublicacionServicio(id);

        // Formatear la respuesta para incluir la información deseada
        const resultado = comentarios.map(comentario => ({
            imagen: comentario.usuario ? comentario.usuario.imagen_usuario : null,
            nombre: comentario.usuario ? comentario.usuario.nombre : 'Desconocido',
            texto: comentario.texto,
            fecha: comentario.fecha
        }));

        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener comentarios:', error);
        res.status(500).json({ message: 'Error al obtener comentarios', error: error.message });
    }
};

// Función para crear un nuevo comentario
const crearComentario = async (req, res) => {
    const { id } = req.params; // ID de la publicación
    const { texto, id_usuario } = req.body; // Asegúrate de que el cuerpo de la solicitud tenga estos campos

    try {
        const nuevoComentario = await Comentario.create({ texto, id_usuario, id_publicacion: id });
        res.status(201).json(nuevoComentario);
    } catch (error) {
        console.error('Error al crear comentario:', error);
        res.status(500).json({ message: 'Error al crear comentario', error: error.message });
    }
};

// Función para eliminar un comentario
const eliminarComentario = async (req, res) => {
    const { id } = req.params; // ID del comentario a eliminar

    try {
        const resultado = await Comentario.destroy({ where: { id_comentario: id } });
        if (resultado) {
            res.json({ message: 'Comentario eliminado' });
        } else {
            res.status(404).json({ message: 'Comentario no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar comentario:', error);
        res.status(500).json({ message: 'Error al eliminar comentario', error: error.message });
    }
};

module.exports = {
    obtenerComentarios,
    crearComentario,
    eliminarComentario,
};
