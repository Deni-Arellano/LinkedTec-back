const FTPClient = require('../../config/ftp');
const FileNotFoundError = require('../exceptions/FileNotFoundError');
const FileTooLargeError = require('../exceptions/FileTooLargeError');
const FileExtensionError = require('../exceptions/FileExtensionError');


const validarImagenYaUsada = async (nombreArchivo) => { //Por si ya existe no se vuelva a subir otra imagen igual 

    const path = `/imagenes/${nombreArchivo}`;

    const archivo = await FTPClient.searchFile(nombreArchivo);
    if (archivo) {
        throw new Error('El archivo ya existe.');
    }
}

const validarImagenExistente = async (nombreArchivo) => { // Comprobamos si la imagen que pasaron si existe

    await FTPClient.connect(); 
    const path = `/imagenes/${nombreArchivo}`;
    try {
        await FTPClient.searchFile(path);

    } catch (error) {

        throw error;


    } finally {
        await FTPClient.disconnect();

    }

    return {value: null};

}


const validarExtension = async (nombreArchivo) => {

    const extensionesPermitidas = ['jpg', 'jpeg', 'png'];
    const extension = nombreArchivo.split('.').pop();

    if (!extensionesPermitidas.includes(extension)) {
        throw new FileExtensionError('La extensión del archivo no es válida. Solo se permiten archivos .jpg, .jpeg y .png');
    }

}

const validarPesoImagen = async (nombreArchivo) => {
    const pesoMaximo = 5 * 1024 * 1024; // 10 MB en bytes
    const pesoArchivo = nombreArchivo.size;

    if (pesoArchivo > pesoMaximo) {
        throw new FileTooLargeError('El tamaño del archivo excede el límite permitido. maximo 5MB');
    }

}

module.exports = {

    validarImagenExistente,
    validarExtension,
    validarPesoImagen,
    validarImagenYaUsada

}