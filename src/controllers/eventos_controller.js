const Evento = require("../models/eventos");
const servicesEvento = require("../services/services_eventos");

const validarEvento = require("../middlewares/validations/validaciones_eventos");

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

exports.obtenerEventosByFecha = async (req, res) => {};
exports.obtenerEventosByUsuario = async (req, res) => {};
exports.registrarAsistenciaEvento = async (req, res) => {};
exports.cancelarAsistenciaEvento = async (req, res) => {};
exports.obtenerUsuariosAsistentes = async (req, res) => {};
exports.obtenerEventosUsuarioAsistira = async (req, res) => {};
exports.buscarEventoPorTitulo = async (req, res) => {};
exports.obtenerEventosPopulares = async (req, res) => {};
