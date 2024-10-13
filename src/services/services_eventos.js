const sequelize = require("../config/database");
const Evento = require("../models/eventos");

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

exports.obtenerEventos = async (pagina = 1, limite = 10) => {
  try {
    const offset = (pagina - 1) * limite;

    const eventos = await Evento.findAndCountAll({
      limit: limite,
      offset: offset
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
      "eventos": eventos.rows,
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

exports.eliminarEvento = async (id) => {
  try {
    const eventoById = await Evento.findByPk(id);

    await eventoById.destroy();

    return eventoById;
  } catch (error) {
    console.error("Error en la función eliminarEvento:", error.message);
  }
};

exports.actualizarEvento = async (id, data) => {
  const eventoEncontrado = await Evento.findByPk(id);

  if (!eventoEncontrado) {
    return false;
  }

  eventoEncontrado.update(data);

  return eventoEncontrado;
};

//Metodos especificos para eventos

exports.obtenerEventosPorTipo = async (tipo) => {
  try {
    const eventosPorTipo = await Evento.findAll({
      where: {
        tipo_evento: tipo,
      },
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
      },
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
          offset
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
