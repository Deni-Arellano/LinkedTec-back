const imagenesService = require('../services/services_imagenes');
const {validarImagenExistente, validarPesoImagen, validarExtension} = require('../middlewares/validations/validaciones_imagenes');
const path = require('path');
const FileUploadError = require('../middlewares/exceptions/FileUploadError');
const FileNotFoundError = require('../middlewares/exceptions/FileNotFoundError');
const ConexionFtpError = require('../middlewares/exceptions/ConexionFtpError');
const FileTooLargeError = require('../middlewares/exceptions/FileTooLargeError');
const FileExtensionError = require('../middlewares/exceptions/FileExtensionError');
const FileDownloadError = require('../middlewares/exceptions/FileDownloadError');

exports.uploadImage = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ningún archivo.' });
        }

        await validarPesoImagen(req.file);
        await validarExtension(req.file.originalname);


        const result = await imagenesService.uploadImage(req.file);
        res.status(200).json(result);


    } catch (error) {

        if (error instanceof FileUploadError) {
            console.log('Error al subir la imagen:', error);
            return res.status(400).json({ error: error.message });

        } else if (error instanceof ConexionFtpError) {
            console.log('Error al subir la imagen:', error);
            return res.status(500).json({ error: error.message});

        } else if (error instanceof FileTooLargeError) {
            console.log('Error al subir la imagen:', error);
            return res.status(413).json({ error: error.message });

        } else if (error instanceof FileNotFoundError) {
            console.log('Error al subir la imagen:', error);
            return res.status(404).json({ error: error.message });

        } else if (error instanceof FileExtensionError) {
            console.log('Error al subir la imagen:', error);

            return res.status(400).json({ error: error.message });

        } else {
            console.error('Error al subir la imagen:', error);
            res.status(500).json({ error: 'Error al procesar la subida de la imagen' });

        }

    }
};


exports.getImage = async (req, res) => {
    try {
        const { fileName } = req.params;

        await validarExtension(fileName);
        await validarImagenExistente(fileName);
        


        const { url, file } = await imagenesService.downloadImage(fileName);
        
        const contentType = getContentType(fileName);
        
        res.contentType(contentType);
        res.send(file);

    } catch (error) {

        if (error instanceof FileNotFoundError) {
            return res.status(404).json({ error: error.message });

        } else if (error instanceof FileExtensionError) {
            return res.status(400).json({ error: error.message });

        } else if (error instanceof FileDownloadError) {
            return res.status(500).json({ error: error.message });
        
        } else if (error instanceof ConexionFtpError) {
            return res.status(500).json({ error: error.message });

        } else {
            res.status(500).json({ error: 'Error al obtener la imagen' });
        }

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