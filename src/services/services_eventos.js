const sequelize = require("../config/database");
const Evento = require("../models/eventos");
const Usuario = require("../models/usuarios");
const Asistencia = require("../models/asistencias");

//funciones de creacion de eventos
exports.crearEvento = async (data) => {
  try {
    const nuevoEvento = await Evento.create({
      titulo: data.titulo,
      fecha: data.fecha,
      lugar: data.lugar,
      descripcion: data.descripcion,
      enlace: data.enlace,
      imagen: data.imagen,
      tipo_evento: data.tipo_evento,
      id_usuario: data.id_usuario,
    });

    return nuevoEvento;
  } catch (error) {
    console.error("Error en la función crearEvento:", error.message);
  }
};

//funciones de asistencia a eventos
exports.registrarAsistenciaEvento = async (idEvento, idUsuario) => {
  try {

      
    const asistencia = await Asistencia.create({
      id_usuario: idUsuario,
      id_evento: idEvento,
    });

    return {mensaje: 'Asistencia registrada con éxito'};
    
  } catch (error) {
    console.error('Error al registrar asistencia a evento:', error);
    throw new Error('Error al registrar asistencia a evento: ' + error.message);
  }
};







//funciones de obtenion de eventos

exports.obtenerEventos = async (pagina = 1, limite = 10) => {
  try {
    const offset = (pagina - 1) * limite;

    const eventos = await Evento.findAndCountAll({
      limit: limite,
      offset: offset,
      order: [
        ['fecha', 'DESC'] 
      ]
    });

    return {
      "total": eventos.count,
      "pagina": pagina,
      "limite": limite,
      "total_paginas": Math.ceil(eventos.count / limite),
      "pagina_siguiente": pagina < Math.ceil(eventos.count / limite) ? {
        "url": `/eventos?pagina=${pagina + 1}&limite=${limite}`,
        "exists": true
      } : {
        "url": null,
        "exists": false
      },
      "pagina_anterior": pagina > 1 ? {
        "url": `/eventos?pagina=${pagina - 1}&limite=${limite}`,
        "exists": true
      } : {
        "url": null,
        "exists": false
      },
      "eventos": eventos.rows, // Aquí vendrán los eventos más recientes primero
    };
  } catch (error) {
    console.error("Error en la función obtenerEventos:", error.message);
    throw new Error('Error al obtener eventos: ' + error.message);
  }
};

exports.obtenerEventoById = async (id) => {
  try {
    const eventoById = await Evento.findByPk(id);

    return eventoById;
  } catch (error) {
    console.error("Error en la función obtenerEventoById:", error.message);
  }
};

exports.obtenerEventosPorTipo = async (tipo) => {
  try {
    const eventosPorTipo = await Evento.findAll({
      where: {
        tipo_evento: tipo,
      }, order: ['fecha', 'DESC']
    });

    return eventosPorTipo;
  } catch (error) {
    console.error("Error en la función obtenerEventosPorTipo:", error.message);
  }
};

exports.obtenerEventosPorUsuario = async (id) => {
  try {
    const eventosPorUsuario = await Evento.findAll({
      where: {
        id_usuario: id,
      }, order: [
        ['fecha', 'DESC']
      ]
    });

    return eventosPorUsuario;
  } catch (error) {
    console.error(
      "Error en la función obtenerEventosPorUsuario:",
      error.message
    );
  }
};

exports.obtenerEventosPorCategoria = async (categoria, page = 1, limit = 10) => {

  try {
      const offset = (page - 1) * limit;

      const eventosPorCategoria = await Evento.findAndCountAll({
          where: {
              tipo_evento: categoria
          },
          limit,
          offset,
          order: [
              ['fecha', 'DESC']
          ]
      });

      const totalPaginas = Math.ceil(eventosPorCategoria.count / limit);
      
      return {
          "total": eventosPorCategoria.count,
          "pagina": page,
          "limite": limit,
          "total_paginas": totalPaginas,
          "pagina_siguiente": page < totalPaginas ? {
              "url": `/eventos/categoria/${categoria}?pagina=${page + 1}&limite=${limit}`,
              "exists": true
          } : {
              "url": null,
              "exists": false
          },
          "pagina_anterior": page > 1 ? {
              "url": `/eventos/categoria/${categoria}?pagina=${page - 1}&limite=${limit}`,
              "exists": true
          } : {
              "url": null,
              "exists": false
          },
          "eventos": eventosPorCategoria.rows,
      };
  } catch (error) {


      throw new Error('Error al obtener eventos por categoría' + error.message);

  }
};

exports.obtenerEventosPorFecha = async (fechaInicio, fechaFin, page = 1, limit = 10) => {

  try {
      const offset = (page - 1) * limit;

      const eventosPorFecha = await Evento.findAndCountAll({
          where: {
              fecha: {
                  [sequelize.Op.between]: [fechaInicio, fechaFin]
              }
          },
          limit,
          offset,
          order: [
              ['fecha', 'DESC']
          ]
      });

      const totalPaginas = Math.ceil(eventosPorFecha.count / limit);
      
      return {
          "total": eventosPorFecha.count,
          "pagina": page,
          "limite": limit,
          "total_paginas": totalPaginas,
          "pagina_siguiente": page < totalPaginas ? {
              "url": `/eventos/fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&pagina=${page + 1}&limite=${limit}`,
              "exists": true
          } : {
              "url": null,
              "exists": false
          },
          "pagina_anterior": page > 1 ? {
              "url": `/eventos/fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&pagina=${page - 1}&limite=${limit}`,
              "exists": true
          } : {
              "url": null,
              "exists": false
          },
          "eventos": eventosPorFecha.rows,
      };
  } catch (error) {
    new Error('Error al obtener eventos por fecha' + error.message);
  }

};

exports.obtenerEventosPorUsuario = async (id, page = 1, limit = 10) => {

  try {

      const offset = (page - 1) * limit;

      const eventosPorUsuario = await Evento.findAndCountAll({
          where: {
              id_usuario: id
          },
          limit,
          offset,
          order: [
              ['fecha', 'DESC']
          ]
      });

      const totalPaginas = Math.ceil(eventosPorUsuario.count / limit);
      
      return {
          "total": eventosPorUsuario.count,
          "pagina": page,
          "limite": limit,
          "total_paginas": totalPaginas,
          "pagina_siguiente": page < totalPaginas ? {
              "url": `/eventos/usuario/${id}?pagina=${page + 1}&limite=${limit}`,
              "exists": true
          } : {
              "url": null,
              "exists": false
          },
          "pagina_anterior": page > 1 ? {
              "url": `/eventos/usuario/${id}?pagina=${page - 1}&limite=${limit}`,
              "exists": true
          } : {
              "url": null,
              "exists": false
          },
          "eventos": eventosPorUsuario.rows,
      };


  } catch (error) {
    new Error('Error al obtener eventos por usuario' + error.message);
  }


};


exports.obtenerUsuariosAsistentes = async (id_evento, pagina = 1, limite = 10) => {
  try {
    const offset = (pagina - 1) * limite; 

    const usuariosAsistentes = await Asistencia.findAndCountAll({ 
      where: {
        id_evento: id_evento
      },
      include: {
        model: Usuario,
        as: 'usuario',
        attributes: ['nombre', 'correo', 'telefono', 'role']
      },
      limit: limite, 
      offset: offset 
    });

    return {
      "total": usuariosAsistentes.count,
      "pagina": pagina,
      "limite": limite,
      "total_paginas": Math.ceil(usuariosAsistentes.count / limite),
      "pagina_siguiente": pagina < Math.ceil(usuariosAsistentes.count / limite) ? {
        "url": `/eventos/${evento_id}/asistencia?pagina=${pagina + 1}&limite=${limite}`,
        "exists": true
      } : {
        "url": null,
        "exists": false
      },
      "pagina_anterior": pagina > 1 ? {
        "url": `/eventos/${evento_id}/asistencia?pagina=${pagina - 1}&limite=${limite}`,
        "exists": true
      } : {
        "url": null,
        "exists": false
      },
      "usuarios": usuariosAsistentes.rows
    };

  } catch (error) {
    throw new Error('Error al obtener usuarios asistentes: ' + error.message); // Lanzar error correctamente
  }
};

//pendiente
exports.obtenerEventosPopulares = async (page = 1, limit = 10) => {

  try {

      const offset = (page - 1) * limit;

      const eventosPopulares = await Evento.findAndCountAll({
        limit,
        offset,
        attributes: {
            include: [
                // Contar el número de asistencias
                [sequelize.literal('(SELECT COUNT(*) FROM confirmacion_asistencia WHERE confirmacion_asistencia.id_evento = Evento.id_evento)'), 'asistencias']
            ]
        },
        include: [
            {
                model: ConfirmacionAsistencia, // Asegúrate de tener el modelo importado
                attributes: [] // No necesitamos atributos de la tabla confirmacion_asistencia
            }
        ],
        group: ['Evento.id_evento'], // Agrupamos por el id del evento
        order: [
            ['fecha', 'DESC'],
            [sequelize.literal('asistencias'), 'DESC'] // Ordenar por asistencias
        ]
    });
    

      return {
          "total": eventosPopulares.count,
          "pagina": page,
          "limite": limit,
          "total_paginas": Math.ceil(eventosPopulares.count / limit),
          "pagina_siguiente": page < Math.ceil(eventosPopulares.count / limit) ? {
              "url": `/eventos/buscar/populares?pagina=${page + 1}&limite=${limit}`,
              "exists": true
          } : {
              "url": null,
              "exists": false
          },
          "pagina_anterior": page > 1 ? {
              "url": `/eventos/buscar/populares?pagina=${page - 1}&limite=${limit}`,
              "exists": true
          } : {
              "url": null,
              "exists": false
          },
          "eventos": eventosPopulares.rows,
      };

  } catch (error) {
    new Error('Error al obtener eventos populares' + error.message);
  }

};

exports.buscarEventoPorTitulo = async (titulo, page = 1, limit = 10) => {

  try {
      const offset = (page - 1) * limit;

      const eventosPorTitulo = await Evento.findAndCountAll({
          where: {
              titulo: {
                  [sequelize.Op.like]: `%${titulo}%`
              }
          },
          limit,
          offset,
          order: [
              ['fecha', 'DESC']
          ]
      });

      const totalPaginas = Math.ceil(eventosPorTitulo.count / limit);
      
      return {
          "total": eventosPorTitulo.count,
          "pagina": page,
          "limite": limit,
          "total_paginas": totalPaginas,
          "pagina_siguiente": page < totalPaginas ? {
              "url": `/eventos/buscar?titulo=${titulo}&pagina=${page + 1}&limite=${limit}`,
              "exists": true
          } : {
              "url": null,
              "exists": false
          },
          "pagina_anterior": page > 1 ? {
              "url": `/eventos/buscar?titulo=${titulo}&pagina=${page - 1}&limite=${limit}`,
              "exists": true
          } : {
              "url": null,
              "exists": false
          },
          "eventos": eventosPorTitulo.rows,
      };
  } catch (error) {
    new Error('Error al buscar evento por título' + error.message);
  }
};






//metodos de eliminacion

exports.eliminarEvento = async (id) => {
  try {
    const eventoById = await Evento.findByPk(id);

    await eventoById.destroy();

    return eventoById;
  } catch (error) {
    console.error("Error en la función eliminarEvento:", error.message);
  }
};

exports.cancelarAsistenciaEvento = async (idEvento, idUsuario) => {
  try {
    console.log('idEvento:', idEvento);
    console.log('idUsuario:', idUsuario);
    const asistencia = await Asistencia.findOne({
      where: {
        id_evento: idEvento,
        id_usuario: idUsuario
      }
    });

    await asistencia.destroy();

    return {mensaje: 'Asistencia cancelada con éxito'};

  } catch (error) {
    console.error("Error en la función cancelarAsistenciaEvento:", error.message);
  }
};

//metodos de actualizacion
exports.actualizarEvento = async (id, data) => {
  const eventoEncontrado = await Evento.findByPk(id);

  if (!eventoEncontrado) {
    return false;
  }

  eventoEncontrado.update(data);

  return eventoEncontrado;
};

//Metodos especificos para eventos


