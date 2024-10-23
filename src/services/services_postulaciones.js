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


    const subida_cloudinary = SubidaCloudinary.registrarArchivo(informacion_archivo);

    const postulacion = await Postulacion.create({
      id_usuario,
      id_empleo,
      descripcion_personal,
      subida_cloudinary,
      id_estado,
    });

    return postulacion; // Devolver la postulación creada


  } catch (error) {
    console.error('Error al crear la postulación:', error);
    throw new Error('Error al crear la postulación');
  };


}

module.exports = {
  obtenerPostulacionesPorUsuario,
  crearPostulacion
};