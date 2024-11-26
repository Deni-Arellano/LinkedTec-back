const cloudinary = require('cloudinary').v2;

class SubirArchivoCloudinary {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async subirImagen(ruta_archivo) {
        try {
            const result = await cloudinary.uploader.upload(ruta_archivo, {
                folder: 'images',
                resource_type: 'image',
            });

            return {
                asset_id: result.asset_id,
                public_id: result.public_id,
                format: result.format,
                resource_type: result.resource_type,
                created_at: result.created_at,
                secure_url: result.secure_url,
                folder: result.folder,
                original_filename: result.original_filename,
            };
        } catch (error) {
            console.error('Error al subir imagen:', error);
            throw new Error('No se pudo subir la imagen a Cloudinary');
        }
    }

    async eliminarImagen(public_id) {
        try {
            const result = await cloudinary.uploader.destroy(public_id);
            return result;
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            throw new Error('No se pudo eliminar la imagen de Cloudinary');
        }
    }

    async obtenerImagen(public_id) {
        try {
            const result = await cloudinary.api.resource(public_id);
            return result;
        } catch (error) {
            console.error('Error al obtener imagen:', error);
            throw new Error('No se pudo obtener la imagen de Cloudinary');
        }
    }

    // Métodos para la gestión de archivos
    async subirArchivo(ruta_archivo) {
        try {
            const result = await cloudinary.uploader.upload(ruta_archivo, {
                folder: 'files',
                resource_type: 'auto',
            });

            return {
                asset_id: result.asset_id,
                public_id: result.public_id,
                format: result.format,
                resource_type: result.resource_type,
                created_at: result.created_at,
                secure_url: result.secure_url,
                folder: result.folder,
                original_filename: result.original_filename,
            };
        } catch (error) {
            console.error('Error al subir archivo:', error);
            throw new Error('No se pudo subir el archivo a Cloudinary');
        }
    }

    async eliminarArchivo(public_id) {
        try {
            const result = await cloudinary.uploader.destroy(public_id);
            return result;
        } catch (error) {
            console.error('Error al eliminar archivo:', error);
            throw new Error('No se pudo eliminar el archivo de Cloudinary');
        }
    }

    async obtenerArchivo(public_id) {
        try {
            const result = await cloudinary.api.resource(public_id);
            return result;
        } catch (error) {
            console.error('Error al obtener archivo:', error);
            throw new Error('No se pudo obtener el archivo de Cloudinary');
        }
    }

    async verificarArchivo(public_id) {
        try {
            const result = await cloudinary.api.resource(public_id);
            return result;
        } catch (error) {
            throw new Error('No se pudo verificar el archivo de Cloudinary');
        }
    }

    // Método para obtener el uso completo de Cloudinary

    async obtenerUsoDeCloudinary() {
        try {
            const result = await cloudinary.api.usage();

            // Extraer solo los datos más relevantes
            const {
                credits,
                bandwidth,
                storage,
                requests,
                resources,
                transformations,
                rate_limit_remaining
            } = result;

            // Estructurar los datos de manera más clara
            const datosEsenciales = {
                creditos_usados: credits.usage,
                creditos_limite: credits.limit,
                ancho_de_banda_usado: bandwidth.usage,
                almacenamiento_usado: storage.usage,
                peticiones_totales: requests,
                recursos_totales: resources,
                transformaciones_totales: transformations.usage,
                limite_de_tasa_restante: rate_limit_remaining,
            };

            return datosEsenciales;
        } catch (error) {
            console.error('Error al obtener los datos de uso de Cloudinary:', error);
            throw new Error('No se pudo obtener la información de uso de Cloudinary');
        }
    }


}

module.exports = SubirArchivoCloudinary;
