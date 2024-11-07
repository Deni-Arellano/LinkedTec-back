const express = require('express');
const multer = require('multer');
const SubirArchivoCloudinary = require('../util/SubirArchivosCloudinary'); 

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); 

const subirArchivoCloudinary = new SubirArchivoCloudinary();

router.post('/subir-imagen', upload.single('imagen'), async (req, res) => {
    try {
        const resultado = await subirArchivoCloudinary.subirImagen(req.file.path);
        res.status(200).json({ mensaje: 'Imagen subida con éxito', data: resultado });

    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});


router.post('/subir-archivo', upload.single('archivo'), async (req, res) => {
    try {
        const resultado = await subirArchivoCloudinary.subirArchivo(req.file.path);
        res.status(200).json({ mensaje: 'Archivo subido con éxito', data: resultado });

    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});


module.exports = router;
