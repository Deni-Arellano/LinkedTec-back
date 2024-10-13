const Evento = require('../models/eventos');
const servicesEvento = require('../services/services_eventos');





exports.crearEvento = async(req, res) => {

    try{
    const { titulo, fecha, lugar, descripcion, enlace, imagen, tipo_evento, id_usuario } = req.body;
    const data = {
        titulo,
        fecha,
        lugar,
        descripcion,
        enlace,
        imagen,
        tipo_evento,
        id_usuario
    };


    const nuevoEvento = await servicesEvento.crearEvento(data);

    res.status(200).json(nuevoEvento);

    } catch (error) {
        console.error('Error en la función crearEvento:', error.message);
        res.status(500).json({error: error.message});
    }

};

exports.obtenerEventos = async(req, res) => {

    try {
        const eventos = await servicesEvento.obtenerEventos();

        res.status(200).json(eventos);

    } catch (error) {
        console.error('Error en la función obtenerEventos:', error.message);
        res.status(500).json({error: error.message});
    }

}

exports.obtenerEventoById = async(req, res) => {
    
        try {
            const id = req.params.id;
            const eventoById = await servicesEvento.obtenerEventoById(id);
    
            res.status(200).json(eventoById);
    
        } catch (error) {
            console.error('Error en la función obtenerEventoById:', error.message);
            res.status(500).json({error: error.message});
        }
    
}

exports.eliminarEvento = async(req, res) => {
        
            try {
                const id = req.params.id;
                const eventoEliminado = await servicesEvento.eliminarEvento(id);
        
                res.status(200).json(eventoEliminado);
        
            } catch (error) {
                console.error('Error en la función eliminarEvento:', error.message);
                res.status(500).json({error: error.message});
            }
        
};

exports.actualizarEvento = async(req, res) => {


        const evento = await servicesEvento.actualizarEvento(req.params.id, req.body);

        if (evento) {
            res.status(200).json(evento);

        } else {
            res.status(400).json({ message: "No se pudo actualizar el evento" });
        }
    
    };
