
const cloudinary = require('cloudinary').v2;


class SubirArchivoCloudinary {


    constructor() {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
      }



    //Metodos para la gestion de imagenes
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

    

    


    




}