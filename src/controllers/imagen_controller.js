const imagenesService = require('../services/services_imagenes');
const path = require('path');

exports.uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo.' });
    }

    try {
        const result = await imageService.uploadImage(req.file);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error en el controlador al subir la imagen:', error);
        res.status(500).json({ error: 'Error al procesar la subida de la imagen' });
    }
};


exports.getImage = async (req, res) => {
    try {
        const { fileName } = req.params;
        const { url, file } = await imagenesService.downloadImage(fileName);
        
        const contentType = getContentType(fileName);
        
        res.contentType(contentType);
        res.send(file);
    } catch (error) {
        console.error('Error al obtener la imagen:', error);
        res.status(500).send('Error al obtener la imagen');
    }
};

function getContentType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        default:
            return 'application/octet-stream';
    }
}