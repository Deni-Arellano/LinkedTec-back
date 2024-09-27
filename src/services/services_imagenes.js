const FTPClient = require('../config/ftp');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs').promises;
const os = require('os');

function generateUniqueFileName(originalName) {
    const date = new Date();
    const timestamp = date.getTime();
    const randomString = crypto.randomBytes(3).toString('hex').toUpperCase();
    const extension = path.extname(originalName);
    return `IMG_${timestamp}_${randomString}${extension}`;
}

exports.uploadImage = async (file) => {
    try {
        console.log('Procesando archivo en el servicio:', file);
        const uniqueFileName = generateUniqueFileName(file.originalname);
        const remotePath = `/imagenes/${uniqueFileName}`;
        
        await FTPClient.connect();
        await FTPClient.uploadFile(file.path, remotePath);
        
        // Cambiamos esto para devolver la ruta relativa
        const relativeUrl = `/imagenes/${uniqueFileName}`;
        
        return {
            fileName: uniqueFileName,
            url: relativeUrl
        };
    } catch (error) {
        console.error('Error en el servicio de subida de imagen:', error);
        throw error;
    } finally {
        await FTPClient.disconnect();
    }
};

exports.downloadImage = async (fileName) => {
    let tempFilePath;
    try {
        await FTPClient.connect();
        const remotePath = `/imagenes/${fileName}`;
        tempFilePath = path.join(os.tmpdir(), fileName);
        
        await FTPClient.downloadFile(remotePath, tempFilePath);
        
        const fileBuffer = await fs.readFile(tempFilePath);
        const relativeUrl = `/imagenes/${fileName}`;
        
        return {
            fileName: fileName,
            url: relativeUrl,
            file: fileBuffer
        };
    } catch (error) {
        console.error('Error al descargar la imagen:', error);
        throw error;
    } finally {
        await FTPClient.disconnect();
        if (tempFilePath) {
            await fs.unlink(tempFilePath).catch(console.error);
        }
    }
};
