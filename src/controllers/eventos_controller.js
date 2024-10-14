const Evento = require("../models/eventos");
const servicesEvento = require("../services/services_eventos");

const validarEvento = require("../middlewares/validations/validaciones_eventos");


//metodos para crear
exports.crearEvento = async (req, res) => {
  try {
    const {
      titulo,
      fecha,
      lugar,
      descripcion,
      enlace,
      imagen,
      tipo_evento,
      id_usuario,
    } = req.body;
    const data = {
      titulo,
      fecha,
      lugar,
      descripcion,
      enlace,
      imagen,
      tipo_evento,
      id_usuario,
    };

    const { error, value } = validarEvento.validarDatosCrearEvento(data);

    if (error) {
      res.status(400).json(error.details);
      return;
    }

    const nuevoEvento = await servicesEvento.crearEvento(data);

    res.status(200).json(nuevoEvento);
  } catch (error) {
    console.error("Error en la función crearEvento:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.registrarAsistenciaEvento = async (req, res) => {
   
        const idEvento = req.params.evento_id;
        const idUsuario = req.params.usuario_id;
    
        const asistencia = await servicesEvento.registrarAsistenciaEvento(
        idEvento,
        idUsuario
        );
    
        res.status(200).json(asistencia);

};





//metodos para obtener

exports.obtenerEventos = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina, 10) || 1;
    const limite = parseInt(req.query.limite, 10) || 10;


    

    const eventos = await servicesEvento.obtenerEventos(pagina, limite);

    res.status(200).json(eventos);
  } catch (error) {
    console.error("Error en la función obtenerEventos:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerEventoById = async (req, res) => {
  try {
    const id = req.params.id;
    const eventoById = await servicesEvento.obtenerEventoById(id);

    res.status(200).json(eventoById);
  } catch (error) {
    console.error("Error en la función obtenerEventoById:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.eliminarEvento = async (req, res) => {
  try {
    const id = req.params.id;
    const eventoEliminado = await servicesEvento.eliminarEvento(id);

    res.status(200).json(eventoEliminado);
  } catch (error) {
    console.error("Error en la función eliminarEvento:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarEvento = async (req, res) => {
  const evento = await servicesEvento.actualizarEvento(req.params.id, req.body);

  if (evento) {
    res.status(200).json(evento);
  } else {
    res.status(400).json({ message: "No se pudo actualizar el evento" });
  }
};

exports.obtenerEventosByCategoria = async (req, res) => {
  try {
    const categoria = req.params.categoria;
    const pagina = parseInt(req.query.pagina, 10) || 1;
    const limite = parseInt(req.query.limite, 10) || 10;

    const eventosPorCategoria = await servicesEvento.obtenerEventosPorCategoria(
      categoria,
      pagina,
      limite
    );

    res.status(200).json(eventosPorCategoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerEventosByFecha = async (req, res) => {

    const pagina = parseInt(req.query.pagina, 10) || 1;
    const limite = parseInt(req.query.limite, 10) || 10;
    const fechaInicio = req.query.fechaInicio;
    const fechaFin = req.query.fechaFin;

    const eventosPorFecha = await servicesEvento.obtenerEventosPorFecha(
      fechaInicio,
      fechaFin,
      pagina,
      limite
    );

};

exports.obtenerEventosByUsuario = async (req, res) => {

    try {
        const id_usuario = req.params.id_usuario;
        const pagina = parseInt(req.query.pagina, 10) || 1;
        const limite = parseInt(req.query.limite, 10) || 10;
        const eventosPorUsuario = await servicesEvento.obtenerEventosPorUsuario(id_usuario, pagina, limite);

        res.status(200).json(eventosPorUsuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

exports.obtenerUsuariosAsistentes = async (req, res) => {

    try {

        const id_evento = req.params.id_evento;
        const pagina = parseInt(req.query.pagina, 10) || 1;
        const limite = parseInt(req.query.limite, 10) || 10;

        const asistentes = await servicesEvento.obtenerUsuariosAsistentes(id_evento, pagina, limite);
        
        res.status(200).json(asistentes);


    } catch (error) {

        res.status(500).json({ error: error.message });
    }

};

exports.obtenerEventosUsuarioAsistira = async (req, res) => {

    try {
        const id_evento = req.params.id_evento;
        const usuario_id = req.params.usuario_id;

        const asistira = await servicesEvento.obtenerEventosUsuarioAsistira(id_evento, usuario_id);

        res.status(200).json(asistira);

    } catch (error) {

        res.status(500).json({ error: error.message });
    }

};

exports.obtenerEventosPopulares = async (req, res) => {

    try {

        const pagina = parseInt(req.query.pagina, 10) || 1;
        const limite = parseInt(req.query.limite, 10) || 10;

        const eventosPopulares = await servicesEvento.obtenerEventosPopulares(pagina, limite);

        res.status(200).json(eventosPopulares);

    } catch (error) {

        res.status(500).json({ error: error.message });
    }

};

exports.obtenerEventosPorTitulo = async (req, res) => {

    try {
        const titulo = req.params.titulo;
        const pagina = parseInt(req.query.pagina, 10) || 1;
        const limite = parseInt(req.query.limite, 10) || 10;

        const eventosPorTitulo = await servicesEvento.obtenerEventosPorTitulo(titulo, pagina, limite);

        res.status(200).json(eventosPorTitulo);

    } catch (error) {

        res.status(500).json({ error: error.message });
    }

};









exports.cancelarAsistenciaEvento = async (req, res) => {

    try {
        const id_evento = req.params.id_evento;
        const id_usuario = req.params.id_usuario;
        

        const cancelarAsistencia = await servicesEvento.cancelarAsistenciaEvento(id_evento, id_usuario);

        res.status(200).json(cancelarAsistencia);

    } catch (error) {

        res.status(500).json({ error: error.message });
    }

};




exports.buscarEventoPorTitulo = async (req, res) => {};
exports.obtenerEventosPopulares = async (req, res) => {};
