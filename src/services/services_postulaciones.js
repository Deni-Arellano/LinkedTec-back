const Usuario = require('../models/usuarios');
const Postulacion = require('../models/postulaciones');
const Estado = require('../models/estados');
const Empleo = require('../models/empleos');
const SubidasCloudinary = require('../models/subidas_cloudinary');
sequelize = require('../config/database');
const SubidaCloudinary = require('../services/services_cloudinary');





//visulaicasion de usarios

const obtenerPostulacionesDeUsuarioService = async (id_usuario, pagina = 1, limite = 10) => {
  const offset = (pagina - 1) * limite;

  const { count, rows } = await Postulacion.findAndCountAll({
    where: { id_usuario },
    include: [
      {
        model: Estado,
        attributes: ['estado'],
      },
      {
        model: Empleo,
        attributes: ['titulo', 'fecha_creacion', 'empresa'],
      },
    ],
    limit: parseInt(limite),
    offset: parseInt(offset),
  });

  const total_paginas = Math.ceil(count / limite);

 
  const postulaciones = rows.map((postulacion) => {
    const empleo = postulacion.Empleo || {};
    const estado = postulacion.Estado || {};

    return {
      id_postulacion: postulacion.id_postulacion,
      id_usuario: postulacion.id_usuario,
      titulo: empleo.titulo || 'Título no disponible',
      fecha: postulacion.fecha_creacion || 'Fecha no disponible',
      empresa: empleo.empresa || 'Empresa no disponible',
      estado: postulacion.estado ? postulacion.estado.estado : 'Estado no disponible',
    };
  });

  return {
    total: count,
    total_paginas,
    postulaciones,
  };
};

const obtenerPostulacionCompletaService = async (id_postulacion) => {
  const postulacion = await Postulacion.findOne({
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
      {
        model: SubidasCloudinary,
        attributes: ['url_segura'],
        where: { id: sequelize.col('Postulacion.cv') },
        required: false,
      },
    ],
  });

  if (!postulacion) {
    throw new Error('Postulación no encontrada');
  }

  return {
    empleo: {
      id_empleo: postulacion.Empleo?.id_empleo || 'ID no disponible',
      titulo: postulacion.Empleo?.titulo || 'Título no disponible',
      empresa: postulacion.Empleo?.empresa || 'Empresa no disponible',
      salario: postulacion.Empleo?.salario || 'Salario no disponible',
      descripcion: postulacion.Empleo?.descripcion || 'Descripción no disponible',
      ubicacion: postulacion.Empleo?.ubicacion || 'Ubicación no disponible',
      nivel_de_ingles: postulacion.Empleo?.nivel_de_ingles || 'Nivel de inglés no disponible',
      fecha_creacion: postulacion.Empleo?.fecha_creacion || 'Fecha de creación no disponible',
    },
    usuario: {
      nombre: postulacion.Usuario?.nombre || 'Nombre no disponible',
      correo: postulacion.Usuario?.correo || 'Correo no disponible',
      descripcion_personal: postulacion.descripcion_personal || 'Descripción personal no disponible',
      cv: postulacion.SubidasCloudinary?.url_segura || 'CV no disponible',
    },
  };
};
//visualizacion de reclutadores
const obtenerPostulantesPorEmpleoService = async (id_empleo, pagina, limite) => {
  const offset = (pagina - 1) * limite;

  const postulaciones = await Postulacion.findAll({
    where: { id_empleo },
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
    limit: parseInt(limite, 10),
    offset: parseInt(offset, 10),
  });

  const totalPostulaciones = await Postulacion.count({ where: { id_empleo } });

  const total_paginas = Math.ceil(totalPostulaciones / limite);

  const resultados = postulaciones.map((postulacion) => {
    return {
      id_usuario: postulacion.id_usuario,
      nombre_usuario: postulacion.Usuario?.nombre || 'Nombre no disponible',
      correo_usuario: postulacion.Usuario?.correo || 'Correo no disponible',
      fecha_creacion: postulacion.fecha_creacion || 'Fecha no disponible',
      estado: postulacion.estado?.estado || 'Estado no disponible',
    };
  });

  return {
    totalPostulaciones,
    total_paginas,
    resultados,
  };
};


const obtenerDetallesPostulantePorId = async (id_empleo, id_usuario) => {
  try {
    const postulacion = await Postulacion.findOne({
      where: { id_empleo, id_usuario },
      include: [
        {
          model: Usuario,
          attributes: ['nombre', 'correo'],
        },
        {
          model: Estado,
          attributes: ['estado'],
        },
        {
          model: SubidasCloudinary,
          attributes: ['url_segura'],
          where: { id: sequelize.col('Postulacion.cv') },
          required: false,
        },
      ],
    });

    if (!postulacion) {
      return null;
    }

    return {
      id_usuario: postulacion.id_usuario,
      nombre_usuario: postulacion.Usuario.nombre,
      correo_usuario: postulacion.Usuario.correo,
      fecha_postulacion: postulacion.fecha_creacion || 'Fecha no disponible',
      estado: postulacion.estado?.estado || 'Estado no disponible',
      descripcion: postulacion.descripcion_personal || 'Descripción no disponible',
      cv: postulacion.SubidasCloudinary?.url_segura || 'CV no disponible',
    };
  } catch (error) {
    console.error('Error al obtener detalles del postulante:', error);
    throw new Error('Error al obtener detalles del postulante');
  }
};

//



async function crearPostulacion(informacion_postulacion) {
  try {
    const informacion_archivo = informacion_postulacion.cv;
    const { id_usuario, id_empleo, descripcion_personal, id_estado } = informacion_postulacion;

    // Subir archivo a Cloudinary
    const subida_cloudinary = await SubidaCloudinary.registrarArchivo(informacion_archivo);
    
    const id_archivo = subida_cloudinary.id; // Este es el ID que necesitas

    
    const postulacion = await Postulacion.create({
      id_usuario,
      id_empleo,
      id_estado,
      cv: id_archivo, // Aquí almacenas el ID de Cloudinary en el campo cv
      descripcion_personal,
    });

    const respuesta = {
      id_postulacion: postulacion.id_postulacion,
      id_usuario: postulacion.id_usuario,
      id_empleo: postulacion.id_empleo,
      id_estado: postulacion.id_estado,
      descripcion_personal: postulacion.descripcion_personal,
      fecha_creacion: postulacion.fecha_creacion,
      cv: postulacion.cv, // El ID del archivo subido a Cloudinary
      archivo: {
        id_archivo: subida_cloudinary.id, // Este es el ID que has subido
        asset_id: subida_cloudinary.id_recurso,
        public_id: subida_cloudinary.id_publico,
        format: subida_cloudinary.formato,
        resource_type: subida_cloudinary.tipo_recurso,
        created_at: subida_cloudinary.fecha_creacion,
        secure_url: subida_cloudinary.url_segura,
        folder: subida_cloudinary.carpeta,
        original_filename: subida_cloudinary.nombre_original,
        type_upload: subida_cloudinary.tipo_subida,
      },
    };

    return respuesta;

  } catch (error) {
    console.error('Error al crear la postulación:', error);
    throw new Error('Error al crear la postulación');
  }
}


module.exports = {
  obtenerPostulacionesDeUsuarioService,
  obtenerPostulacionCompletaService,
  obtenerPostulantesPorEmpleoService,
  obtenerDetallesPostulantePorId,
  crearPostulacion
};