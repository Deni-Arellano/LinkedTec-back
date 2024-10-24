const Usuario = require('../models/usuarios');
const Postulacion = require('../models/postulaciones');
const Estado = require('../models/estados');
const SubidaCloudinary = require('../services/services_cloudinary');



async function obtenerPostulacionesPorUsuario(id_usuario) {
  try {
    const postulaciones = await Postulacion.findAll({
      where: { id_usuario: id_usuario }, 
      include: {
        model: Estado,
        attributes: ['estado'], 
      },
    });

    return postulaciones; // Devolver las postulaciones encontradas
  } catch (error) {
    console.error('Error en el servicio al obtener las postulaciones:', error);
    throw new Error('Error al obtener las postulaciones');
  }
}

async function crearPostulacion (informacion_postulacion) {
  try {
    const informacion_archivo = informacion_postulacion.cv;
    const {id_usuario, id_empleo, descripcion_personal, id_estado} = informacion_postulacion;

    const subida_cloudinary = await SubidaCloudinary.registrarArchivo(informacion_archivo);

    const id_archivo = subida_cloudinary.id_archivo;

    const postulacion = await Postulacion.create({
      id_usuario,
      id_empleo,
      id_estado,
      id_archivo,
      descripcion_personal
    });

    const respuesta = {
      id_postulacion: postulacion.id_postulacion,
      id_usuario: postulacion.id_usuario,
      id_empleo: postulacion.id_empleo,
      id_estado: postulacion.id_estado,
      descripcion_personal: postulacion.descripcion_personal,
      fecha_creacion: postulacion.fecha_creacion,
      cv: postulacion.cv,
      archivo: {
        id_archivo: subida_cloudinary.id,
        asset_id: subida_cloudinary.id_recurso,
        public_id: subida_cloudinary.id_publico,
        format: subida_cloudinary.formato,
        resource_type: subida_cloudinary.tipo_recurso,
        created_at: subida_cloudinary.fecha_creacion,
        secure_url: subida_cloudinary.url_segura,
        folder: subida_cloudinary.carpeta,
        original_filename: subida_cloudinary.nombre_original,
        type_upload: subida_cloudinary.tipo_subida
      }
    };

    return respuesta;

  } catch (error) {
    console.error('Error al crear la postulación:', error);
    throw new Error('Error al crear la postulación');
  }
}


module.exports = {
  obtenerPostulacionesPorUsuario,
  crearPostulacion
};