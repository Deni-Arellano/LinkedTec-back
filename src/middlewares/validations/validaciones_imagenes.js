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


const validarExtension = (nombreArchivo) => {

    const extensionesPermitidas = ['jpg', 'jpeg', 'png'];
    const extension = nombreArchivo.split('.').pop();

    if (!extensionesPermitidas.includes(extension)) {
        throw new Error('La extensión del archivo no es válida.');
    }
    return {value: null};
}

const validarPesoImagen = (nombreArchivo) => {
    const pesoMaximo = 5 * 1024 * 1024; // 10 MB en bytes
    const pesoArchivo = nombreArchivo.size;

    if (pesoArchivo > pesoMaximo) {
        throw new Error('El tamaño del archivo excede el límite permitido.');
    }

    return {value: null};

}

module.exports = {

    validarImagenNoExistente,
    validarExtension
}