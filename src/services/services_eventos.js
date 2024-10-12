const sequelize = require('../config/database');
const evento = require('../models/eventos');


exports.crearEvento = async (data) => {


    try {


        const nuevoEvento = await evento.create({
            nombre: data.nombre,
            descripcion: data.descripcion,
            fecha: data.fecha,
            hora: data.hora,
            lugar: data.lugar,
            imagen: data.imagen,
            id_usuario: data.id_usuario
        });

        return nuevoEvento;


    } catch (error) {
        console.error('Error en la función crearEvento:', error.message);
    }

};