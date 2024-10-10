const NoticiaService = require('../services/services_noticias.js');


/**
 * @async
 * Crear una nueva noticia en la base de datos.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con la noticia creada o un error.
 */
exports.createNoticia = async (req, res) => {
    try {
        const { titulo, descripcion, imagen_noticia, enlace_noticia, fecha_noticia, categoria_noticia, id_usuario } = req.body;

        if (!titulo || !descripcion || !categoria_noticia || !id_usuario) {
            return res.status(400).json({ message: "Los campos obligatorios no pueden estar vacíos" });
        }

        const categoriasPermitidas = ['IE', 'ISC', 'II', 'IA', 'CP', 'IGE'];
        if (!categoriasPermitidas.includes(categoria_noticia)) {
            return res.status(400).json({ message: "Categoría no válida" });
        }

        const resultado = await NoticiaService.crearNoticia({
            titulo_noticia: titulo,
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



/**
 * Controlador para obtener una noticia por su ID
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @returns {Promise<void>} - Devuelve la noticia o un error.
 */
exports.obtenerNoticiaPorId = async (req, res) => {
    const { id } = req.params;
  
    try {
        console.log(id);
      const noticia = await obtenerNoticiaPorIdServicio(id);
      res.status(200).json(noticia);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
