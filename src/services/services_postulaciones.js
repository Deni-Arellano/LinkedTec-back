const Usuario = require('../models/usuarios');
const Postulacion = require('../models/postulaciones');
const Estado = require('../models/estados');


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




const obtenerPostulacionCompletaPorId = async (id_postulacion) => {
  try {
    return await Postulacion.findOne({
      where: { id_postulacion },
      include: [
        {
          model: Usuario,
          attributes: ['nombre', 'correo'],
        },
        {
          model: Empleo,
          attributes: [
            'id_empleo',
            'titulo',
            'empresa',
            'salario',
            'descripcion',
            'ubicacion',
            'nivel_de_ingles',
            'fecha_creacion',
          ],
        },
      ],
    });
  } catch (error) {
    throw new Error('Error al obtener la postulación');
  }
};



const obtenerPostulantesPorEmpleo = async (id_empleo) => {
  try {
    const postulaciones = await Postulacion.findAll({
      where: { id_empleo },
      include: [
        {
          model: Usuario,
          attributes: ['nombre', 'correo'], // Obtener nombre y correo del usuario
        },
        {
          model: Estado,
          attributes: ['estado'], // Obtener el estado de la postulación si es necesario
        },
      ],
    });

    return postulaciones;
  } catch (error) {
    console.error('Error al obtener postulantes:', error);
    throw new Error('Error al obtener postulantes'); // Lanzar error para manejarlo en el controlador
  }
};


const obtenerDetallesPostulantePorId = async (id_empleo, id_usuario) => {
  try {
    const postulacion = await Postulacion.findOne({
      where: { id_empleo, id_usuario }, // Filtrar por id_empleo y id_usuario
      include: [
        {
          model: Usuario,
          attributes: ['nombre', 'correo'],
        },
        {
          model: Estado,
          attributes: ['estado'],
        },
      ],
    });

    console.log(postulacion); // Verificar si se está obteniendo un resultado

    return postulacion;
  } catch (error) {
    console.error('Error al obtener los detalles del postulante:', error);
    throw error;
  }
};


module.exports = {
  obtenerPostulacionesPorUsuario,
  obtenerPostulacionCompletaPorId,
  //reclutador
  obtenerPostulantesPorEmpleo,
  obtenerDetallesPostulantePorId
};