const NoticiaService = require('../services/services_noticias.js');
const validarNoticia = require('../middlewares/validations/validaciones_noticias.js');


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
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};





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
        const noticia = await NoticiaService.obtenerNoticiaPorId(id_noticia);

        if (noticia) {
            return res.status(200).json(noticia);
        } else {
            return res.status(404).json({ message: "Noticia no encontrada" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

exports.obtenerTodasLasNoticias = async (req, res) => {
    try {
        const { success, data, error } = await NoticiaService.obtenerTodasLasNoticias();

        if (success) {
            return res.status(200).json(data);
        } else {
            return res.status(404).json({ message: error });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};