const Publicacion = require('../models/publicaciones');

// Función para crear una nueva publicación
const crearPublicacionService = async (datosPublicacion) => {
  const { texto, imagen, id_usuario } = datosPublicacion;

  const nuevaPublicacion = await Publicacion.create({
    texto,
    imagen,
    fecha: new Date(),
    id_usuario,
  });

  return nuevaPublicacion;
};

const obtenerPublicacionesPorUsuarioService = async (id_usuario) => {
  const publicaciones = await Publicacion.findAll({
    where: { id_usuario }
  });
  return publicaciones;
};

const obtenerPublicacionPorIdService = async (id_publicacion) => {
  const publicacion = await Publicacion.findByPk(id_publicacion);
  return publicacion;
};

const obtenerTodasLasPublicacionesService = async () => {
  const publicaciones = await Publicacion.findAll();
  return publicaciones;
};




module.exports = {
  crearPublicacionService,
  obtenerPublicacionesPorUsuarioService,
  obtenerPublicacionPorIdService,
  obtenerTodasLasPublicacionesService
};
