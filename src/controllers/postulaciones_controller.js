const {} = require('../services/services_postulaciones');
const Postulacion = require('../models/postulaciones');
const Estado = require('../models/estados'); // Modelo para la tabla estados

const obtenerPostulacionesDeUsuario = async (req, res) => {
    try {
      const { id } = req.params; // Obtener el ID del usuario de los parámetros
      const { page = 1, limit = 2 } = req.query; // Obtener parámetros de paginación
      const offset = (page - 1) * limit; // Calcular el offset
  
      // Asegúrate de convertir los valores a enteros
      const pageInt = parseInt(page);
      const limitInt = parseInt(limit);
  
      // Contar total de postulaciones del usuario
      const count = await Postulacion.count({ where: { id_usuario: id } });
      const total_paginas = Math.ceil(count / limitInt); // Calcular el total de páginas
  
      // Obtener postulaciones del usuario con paginación
      const postulaciones = await Postulacion.findAll({
        where: { id_usuario: id },
        limit: limitInt,
        offset: offset,
        include: [{
          model: Estado,
          attributes: ['estado'], // Solo queremos el estado, no el id
        }],
      });
  
      // Construir los objetos de paginación
      const pagina_siguiente = pageInt < total_paginas ? {
        url: `http://localhost:3000/postulaciones/${id}?pagina=${pageInt + 1}&limite=${limitInt}`,
        exists: true,
      } : {
        url: null,
        exists: false,
      };
  
      const pagina_anterior = pageInt > 1 ? {
        url: `http://localhost:3000/postulaciones/${id}?pagina=${pageInt - 1}&limite=${limitInt}`,
        exists: true,
      } : {
        url: null,
        exists: false,
      };
  
      // Estructurar la respuesta con paginación y postulaciones
      const response = {
        total: count,
        pagina: pageInt,
        limite: limitInt,
        total_paginas: total_paginas,
        pagina_siguiente,
        pagina_anterior,
        postulaciones, // Aquí incluimos la lista de postulaciones
      };
  
      return res.json(response); // Devolvemos la respuesta completa
  
    } catch (error) {
      console.error("Error al obtener las postulaciones:", error);
      return res.status(500).json({ error: "Error al obtener las postulaciones" });
    }
  };
  
const crearPostulacion = async (req, res) => {

  try {

      const informacionPostulacion = req.body;
      


  }catch (error) {

    res.status(500).json({ error: "Error al crear la postulación" });

  }


};





  

module.exports = {
    obtenerPostulacionesDeUsuario,
    crearPostulacion
};