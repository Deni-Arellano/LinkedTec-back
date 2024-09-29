const FTPClient = require('../../config/ftp');

const validarImagenYaUsada = async (nombreArchivo) => { //Por si ya existe no se vuelva a subir otra imagen igual 

    const path = `/imagenes/${nombreArchivo}`;

    const archivo = await FTPClient.searchFile(nombreArchivo);
    if (archivo) {
        throw new Error('El archivo ya existe.');
    }
}

const validarImagenNoExistente = async (nombreArchivo) => { // Comprobamos si la imagen que pasaron si existe

    await FTPClient.connect(); //Abrimos la coneccion FTP
    console.log("Nombre del archivo: " + nombreArchivo);
    const path = `/imagenes/${nombreArchivo}`;
    try {
        await FTPClient.searchFile(path);

    } catch (error) {
        throw new Error('El archivo no existe.');

    }

    await FTPClient.disconnect();
    return {value: null};

}



module.exports = {

    validarImagenNoExistente
}