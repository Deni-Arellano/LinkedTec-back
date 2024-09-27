const Comentario = require('../models/comentarios'); // Asegúrate de que sea Comentario
const Usuario = require('../models/usuarios'); // Asegúrate de importar el modelo Usuario
const { obtenerComentariosPorPublicacion: obtenerComentariosPorPublicacionServicio } = require('../services/services_comentarios');

// Función para obtener todos los comentarios de una publicación
const obtenerComentarios = async (req, res) => {
    const { id } = req.params; 

    try {
        const comentarios = await obtenerComentariosPorPublicacionServicio(id);

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

// Función para obtener un comentario específico por id_publicacion y id_comentario
const obtenerComentarioPorPublicacionYComentario = async (req, res) => {
    const { id_publicacion, id_comentario } = req.params; 

    try {
        const comentario = await Comentario.findOne({
            where: {
                id_publicacion: id_publicacion,
                id_comentario: id_comentario
            },
            include: [{
                model: Usuario, // Asegúrate de que este es el nombre correcto de tu modelo
                as: 'usuario', // Asegúrate de que el alias coincida con el definido en tu modelo
                attributes: ['imagen_usuario', 'nombre']
            }]
        });

        if (!comentario) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }

        const resultado = {
            imagen: comentario.usuario ? comentario.usuario.imagen_usuario : null,
            nombre: comentario.usuario ? comentario.usuario.nombre : 'Desconocido',
            texto: comentario.texto,
            fecha: comentario.fecha
        };

        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener comentario:', error);
        res.status(500).json({ message: 'Error al obtener comentario', error: error.message });
    }
};

module.exports = {
    obtenerComentarios,
    crearComentario,
    eliminarComentario,
    obtenerComentarioPorPublicacionYComentario // Exporta esta nueva función
};
