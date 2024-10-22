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

module.exports = {
  obtenerPostulacionesPorUsuario,
  obtenerPostulacionCompletaPorId
};