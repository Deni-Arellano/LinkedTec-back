const NoticiaService = require('../services/services_noticias.js');
const UsuarioService = require('../services/services_usuarios.js'); 
const { validarNoticia, validarNoticiaExistente, validarNoticiaInexistente } = require('../middlewares/validations/validaciones_noticias.js');
const NewsExistsError = require('../middlewares/exceptions/NewsExistsError.js');
const { and, or } = require('sequelize');


/**
 * @async
 * Crear una nueva noticia en la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con la noticia creada o un error.
 */
exports.createNoticia = async (req, res) => {
    
    try {
        const { titulo_noticia, descripcion, imagen_noticia, enlace_noticia, fecha_noticia, categoria_noticia, id_usuario } = req.body;

        const usuario = await UsuarioService.obtenerUsuarioPorId(id_usuario);
        if (!usuario || (usuario.role !== 'Docentes' && usuario.role !== 'Egresados')) {
            return res.status(403).json({ message: 'Solo los usuarios con rol Docentes o Egresados pueden crear noticias' });
        }

        await validarNoticiaExistente(req.body);

        const error = validarNoticia(req.body); 
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const resultado = await NoticiaService.crearNoticia({
            titulo_noticia,
            descripcion,
            imagen_noticia,
            enlace_noticia,
            fecha_noticia,
            categoria_noticia,
            id_usuario 
        });

        if (resultado.success) {
            return res.status(201).json(resultado.data);
        } else {
            return res.status(400).json({ message: resultado.error });
        }
    } catch (error) {
        if (error instanceof NewsExistsError) {
            return res.status(409).json({ message: error.message });
        }

        return res.status(500).json({ message: "Error en el servidor, por favor intenta más tarde." });
    }
};





/**
 * 
 * @param {id} req Id de la noticia a eliminar 
 * @returns Retorna un mensaje de confirmación o un mensaje de error
 */
exports.eliminarNoticia = async (req, res) => {

    try {

        const {id_noticia} = req.params;
        
        if (NoticiaService.eliminarNoticia(id_noticia)) {
            return res.status(200).json({ message: "Noticia eliminada correctamente" });

        } else {
            return res.status(400).json({ message: "No se pudo eliminar la noticia" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });

    }
};


exports.actualizarNoticia = async (req, res) => {

    try {


        const noticia = await NoticiaService.actualizarNoticia(req.params.id_noticia, req.body);

        if (noticia) {
            return res.status(200).json(noticia);
        } else {
            return res.status(400).json({ message: "No se pudo actualizar la noticia" });
        }


    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });

    }


};


exports.obtenerNoticiaPorId = async (req, res) => {
    try {
        const { id_noticia } = req.params;

        console.log("id noticia",id_noticia);
        await validarNoticiaInexistente({id_noticia}); // Esto debería lanzar un error si no existe

        // Obtener la noticia
        const noticia = await NoticiaService.obtenerNoticiaPorId(id_noticia);

        if (noticia.success) {
            return res.status(200).json(noticia.data);
        } else {
            return res.status(404).json({ message: noticia.error });
        }
    } catch (error) {
        console.error('Error al obtener noticia:', error);
        if (error.name === 'NewsNotFoundError') {
            return res.status(404).json({ message: "Noticia no encontrada" });
        }
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

exports.obtenerTodasLasNoticias = async (req, res) => {
    try {
        // Obtener parámetros de paginación de la solicitud
        const pagina = parseInt(req.query.pagina) || 1; // Página actual, por defecto 1
        const limite = parseInt(req.query.limite) || 10; // Límite de elementos por página, por defecto 10
        const offset = (pagina - 1) * limite; // Cálculo del offset

        // Obtener todas las noticias desde el servicio
        const { success, data, error } = await NoticiaService.obtenerTodasLasNoticias();

        // Revisar si se encontraron noticias
        if (!success || data.length === 0) {
            return res.status(404).json({ message: "No se encontraron noticias." });
        }

        // Calcular el total de noticias y las páginas
        const total = data.length; // Total de noticias
        const totalPaginas = Math.ceil(total / limite); // Total de páginas

        // Obtener solo las noticias de la página actual
        const noticiasPagina = data.slice(offset, offset + limite);

        // Crear respuesta con paginación
        const response = {
            total,
            pagina,
            limite,
            total_paginas: totalPaginas,
            pagina_siguiente: {
                url: pagina < totalPaginas ? `http://localhost:3000/noticias?pagina=${pagina + 1}&limite=${limite}` : null,
                exists: pagina < totalPaginas
            },
            pagina_anterior: {
                url: pagina > 1 ? `http://localhost:3000/noticias?pagina=${pagina - 1}&limite=${limite}` : null,
                exists: pagina > 1
            },
            noticias: noticiasPagina // Enviamos solo las noticias de la página actual
        };

        return res.status(200).json(response);
    } catch (error) {
        // Manejo de errores
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};
