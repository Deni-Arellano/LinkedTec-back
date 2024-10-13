const sequelize = require('../config/database');
const evento = require('../models/eventos');


exports.crearEvento = async (data) => {


    try {


        const nuevoEvento = await evento.create({

            titulo: data.titulo,
            fecha: data.fecha,
            lugar: data.lugar,
            descripcion: data.descripcion,
            enlace: data.enlace,
            imagen: data.imagen,
            tipo_evento: data.tipo_evento,
            id_usuario: data.id_usuario
            
        });

        return nuevoEvento;


    } catch (error) {
        console.error('Error en la función crearEvento:', error.message);
    }

};


exports.obtenerEventos = async () => {

    try {

        const eventos = await evento.findAll();

        return eventos;

    } catch (error) {
        console.error('Error en la función obtenerEventos:', error.message);
    }


};

exports.obtenerEventoById = async (id) => {
    
    try {
    
        const eventoById = await evento.findByPk(id);
    
        return eventoById;
    
    } catch (error) {
        console.error('Error en la función obtenerEventoById:', error.message);
    }
    
};


exports.eliminarEvento = async (id) => {
        
        try {
        

            const eventoById = await evento.findByPk(id);
        
            await eventoById.destroy();
        
            return eventoById;

        
        } catch (error) {
            console.error('Error en la función eliminarEvento:', error.message);
        }
        
};

exports.actualizarEvento = async (id, data) => {
        

        
    const eventoEncontrado = await evento.findByPk(id);
        
    if (!eventoEncontrado) {
        return false;
    }

    eventoEncontrado.update(data);
        
    return eventoEncontrado;

};