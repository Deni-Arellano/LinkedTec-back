const Comentario = require('../models/comentarios'); // Asegúrate de que sea Comentario
const Usuario = require('../models/usuarios');

const { obtenerComentariosPorPublicacion: obtenerComentariosPorPublicacionServicio } = require('../services/services_comentarios');
const { validarComentario, validarComentarioExiste, validarComentarioExistente, validarDescarga, validarimagen } = require('../middlewares/validations/validaciones_comentarios');
const {validarPublicacionExistente} = require('../middlewares/validations/validaciones_comentarios');
const CommentNotFoundError = require('../middlewares/exceptions/CommentNotFoundError');

const obtenerComentarios = async (req, res) => {
    const { id } = req.params; // ID de la publicación
    const pagina = parseInt(req.query.pagina) || 1; // Página actual, por defecto 1
    const limite = parseInt(req.query.limite) || 10; // Límite de elementos por página, por defecto 10
    const offset = (pagina - 1) * limite; // Cálculo del offset

    try {
        // Validar si la publicación existe
        await validarPublicacionExistente(id);

        // Obtener los comentarios de la publicación usando el servicio
        const comentarios = await obtenerComentariosPorPublicacionServicio(id);

        // Ordenar los comentarios por fecha (más recientes primero)
        const comentariosOrdenados = comentarios.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        // Total de comentarios
        const total = comentariosOrdenados.length;
        const totalPaginas = Math.ceil(total / limite);

        // Obtener los comentarios de la página actual usando offset
        const comentariosPagina = comentariosOrdenados.slice(offset, offset + limite);

        // Mapear los comentarios para formatear la respuesta
        const resultado = comentariosPagina.map(comentario => ({
            imagen: comentario.usuario ? comentario.usuario.imagen_usuario : null,
            nombre: comentario.usuario ? comentario.usuario.nombre : 'Desconocido',
            apellido_paterno: comentario.usuario ? comentario.usuario.apellido_paterno : 'Desconocido',
            apellido_materno: comentario.usuario ? comentario.usuario.apellido_materno : 'Desconocido',
            texto: comentario.texto,
            fecha: comentario.fecha
        }));

        // Crear respuesta de paginación
        const response = {
            total,
            pagina,
            limite,
            total_paginas: totalPaginas,
            pagina_siguiente: {
                url: pagina < totalPaginas ? `http://localhost:3000/publicaciones/comentarios/${id}?pagina=${pagina + 1}&limite=${limite}` : null,
                exists: pagina < totalPaginas
            },
            pagina_anterior: {
                url: pagina > 1 ? `http://localhost:3000/publicaciones/comentarios/${id}?pagina=${pagina - 1}&limite=${limite}` : null,
                exists: pagina > 1
            },
            comentarios: resultado
        };

        // Enviar la respuesta con los comentarios y la paginación
        return res.status(200).json(response);

    } catch (error) {
        console.error('Error al obtener comentarios:', error);

        // Capturar y manejar el error lanzado por el servicio
        if (error.name === 'CommentNotFoundError') {
            return res.status(404).json({ message: 'No se encuentran comentarios en la publicación' });
        }

        // Manejar otros posibles errores
        if (error.name === 'FileDownloadError') {
            return res.status(500).json({ message: 'Error al obtener la imagen' });
        }
        if (error.name === 'FileNotFoundError') {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }
        if (error.name === 'PublicationNotFoundError') {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }

        res.status(500).json({ message: 'Error al obtener comentario', error: error.message });
    }
};



const crearComentario = async (req, res) => {
    const { texto, id_usuario} = req.body; // Extraer todos los campos del cuerpo
    const id_publicacion = req.params.id; 

    
    const { error } = validarComentario({ texto, id_usuario, id_publicacion });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        
        const usuarioExistente = await Usuario.findOne({ where: { id: id_usuario } });
        if (!usuarioExistente) {
            return res.status(404).json({ message: 'El usuario no existe.' });
        }

        // Crear el nuevo comentario
        const nuevoComentario = await Comentario.create({ texto, id_usuario, id_publicacion });
        res.status(201).json(nuevoComentario);
    } catch (error) {

        console.error('Error al crear comentario:', error);
        res.status(500).json({ message: 'Error al crear comentario', error: error.message });
        
    }
};

// Función para eliminar un comentario
const eliminarComentario = async (req, res) => {
    const { id } = req.params; 

    try {
        
        await validarComentarioExistente(id);
        const resultado = await Comentario.destroy({ where: { id_comentario: id } });
        if (resultado) {
            res.json({ message: 'Comentario eliminado' });
        } else {
            res.status(404).json({ message: 'Comentario no encontrado' });
        }
    } catch (error) {
        if (error.name === 'CommentNotFoundError') {
            return res.status(404).json({ message: 'Error al eleminar el comentario' });
        }
      
        console.error('Error al eliminar comentario:', error);
        res.status(500).json({ message: 'Error al eliminar comentario', error: error.message });
        
    }
};

// Función para obtener un comentario específico por id_publicacion y id_comentario
const obtenerComentarioPorPublicacionYComentario = async (req, res) => {
    const { id_publicacion, id_comentario } = req.params; 

    try {
        console.log('id_comnetarios', id_comentario);
        console.log('id_publicacion', id_publicacion);
        // Validar la existencia del comentario y la publicación
        await validarComentarioExistente(id_comentario);
        await validarPublicacionExistente(id_publicacion);


        // Buscar el comentario en la base de datos con la publicación y comentario proporcionados
        const comentario = await Comentario.findOne({
            where: {
                id_publicacion: id_publicacion,
                id_comentario: id_comentario
            },
            include: [{
                model: Usuario,
                as: 'usuario',   
                attributes: ['imagen_usuario', 'nombre', 'apellido_paterno', 'apellido_materno'] 
            }]
        });

        // Verificar si se encontró el comentario
        if (!comentario) {
            throw new CommentNotFoundError();
        }

        // Validar que exista la imagen de usuario antes de intentar descargarla
        const imagenUsuario = comentario.usuario ? comentario.usuario.imagen_usuario : null;


        // Validar y descargar la imagen
        await validarimagen(imagenUsuario);
        await validarDescarga(imagenUsuario);

        // Construir el resultado de la respuesta
        const resultado = {
            imagen: comentario.usuario ? comentario.usuario.imagen_usuario : null,
            nombre: comentario.usuario ? comentario.usuario.nombre : 'Desconocido',
            apellido_paterno: comentario.usuario ? comentario.usuario.apellido_paterno : 'Desconocido',
            apellido_materno: comentario.usuario ? comentario.usuario.apellido_materno : 'Desconocido',
            texto: comentario.texto,
            fecha: comentario.fecha
        };

       
        res.json(resultado);

    } catch (error) {
 
      
        if (error.name === 'FileNotFoundError') {
            return res.status(404).json({ message: 'Imagen no encontrada' });
        }
        if (error.name === 'PublicationNotFoundError') {
            return res.status(404).json({ message: 'Publicación no encontrada' });
        }
        if (error.name === 'CommentNotFoundError') {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
        if (error.name === 'FileDownloadError') {
            return res.status(500).json({ message: 'Error al obtener la imagen' });
        }

        console.error('Error al obtener comentario:', error);
        res.status(500).json({ message: 'Error al obtener comentario', error: error.message });
    }
};


module.exports = {
    obtenerComentarios,
    crearComentario,
    eliminarComentario,
    obtenerComentarioPorPublicacionYComentario 
};
