const SubidasCloudinary = require('../models/subidas_cloudinary');


async function registrarArchivo (informacion) {

    try {
        const archivo = await SubidasCloudinary.create(informacion);
        return archivo;


    } catch (error) {

        console.error('Error al registrar el archivo:', error);
        throw new Error('Error al registrar el archivo');
    }
}

module.exports = {

    registrarArchivo
};