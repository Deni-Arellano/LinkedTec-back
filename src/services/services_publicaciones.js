const Publicacion = require('../models/publicaciones');
const Usuario = require('../models/usuarios');
const {Sequelize} = require('sequelize');
const sequelize = require('../config/database');


/**
 * Función para crear una nueva publicación.
 * @param {Object} datosPublicacion - Datos de la publicación a crear.
 * @returns {Promise<Object>} La nueva publicación creada.
 */
const crearPublicacionService = async (datosPublicacion) => {
    try {

        const {descripcion, imagen, id_usuario} = datosPublicacion;

        // Crea una nueva publicación en la base de datos
        const nuevaPublicacion = await Publicacion.create({
            descripcion,
            imagen,
            fecha: new Date(), // Establece la fecha actual
            id_usuario,
            me_gusta: 0, // Inicializa me_gusta en 0
            disgusta: 0 // Inicializa disgusta en 0
        });

        return nuevaPublicacion;

    } catch (error) {
        console.error('Error al crear la publicación:', error);
        throw error;
    }
};


/**
 * Función para obtener todas las publicaciones de un usuario específico.
 * @param {number} id_usuario - ID del usuario cuyas publicaciones se quieren obtener.
 * @returns {Promise<Array>} Lista de publicaciones del usuario.
 */
const obtenerPublicacionesPorUsuarioService = async (id_usuario, pagina = 1, limite = 10) => {
    try {
        const offset = (pagina - 1) * limite;

        const publicacionesPorUsuario = await Publicacion.findAndCountAll({
            where: {id_usuario},
            limite,
            offset,
            order: [['fecha', 'DESC']]
        });
        const totalPaginas = Math.ceil(publicacionesPorUsuario.count / limite);

        return {
            "total": publicacionesPorUsuario.count,
            "pagina": pagina,
            "limite": limite,
            "total_paginas": totalPaginas,
            "pagina_siguiente": pagina < totalPaginas ? {
                "url": `/publicaciones/usuario/${id_usuario}?pagina=${pagina + 1}&limite=${limite}`,
                "exists": true
            } : {
                "url": null,
                "exists": false
            },
            "pagina_anterior": pagina > 1 ? {
                "url": `/publicaciones/usuario/${id_usuario}?pagina=${pagina - 1}&limite=${limite}`,
                "exists": true
            } : {
                "url": null,
                "exists": false
            },
            "publicaciones": publicacionesPorUsuario.rows,
        };
    } catch (error) {
        console.log('Error al obtener publicaciones por usuario:', error);
        throw new Error('Error al obtener publicaciones por usuario: ' + error.message);

    }
};


/**
 * Función para obtener una publicación específica por su ID.
 * @param {number} id_publicacion - ID de la publicación a obtener.
 * @returns {Promise<Object|null>} La publicación encontrada o null si no existe.
 */
const obtenerPublicacionPorIdService = async (id_publicacion) => {
    // Busca la publicación por su ID
    const publicacion = await Publicacion.findByPk(id_publicacion);
    return publicacion; // Devuelve la publicación encontrada o null
};

/**
 * Función para obtener todas las publicaciones con paginación.
 * @param {number} page - Número de la página.
 * @param {number} limit - Cantidad de publicaciones por página.
 * @returns {Promise<Object>} Lista paginada de publicaciones.
 */
const obtenerTodasLasPublicacionesService = async (pagina = 1, limite = 10, informacionCompleta = false) => {
    try {
        const offset = (pagina - 1) * limite;

        // Preparamos la consulta base
        const queryOptions = {
            limite,
            offset,
            order: [['fecha', 'DESC']], // Ordena por fecha en orden descendente
            raw: true // Esto hace que los resultados vengan como objetos planos
        };

        // Si informacionCompleta es verdadero, incluye los datos del usuario como atributos adicionales
        if (informacionCompleta) {
            queryOptions.attributes = [
                '*',  // Selecciona todos los campos de la publicación
                [sequelize.fn('concat',
                    sequelize.col('Usuario.nombre'),
                    ' ',
                    sequelize.col('Usuario.apellido_paterno'),
                    ' ',
                    sequelize.col('Usuario.apellido_materno')
                ), 'nombreCompleto'],
                [sequelize.col('Usuario.imagen_usuario'), 'fotoPerfil']
            ];

            queryOptions.include = [{
                model: Usuario,
                attributes: [], // No incluimos atributos directamente del modelo Usuario
                required: false
            }];
        }

        // Busca todas las publicaciones con paginación y ordenadas por fecha
        const publicaciones = await Publicacion.findAndCountAll(queryOptions);

        const totalPaginas = Math.ceil(publicaciones.count / limite);

        // Preparar la respuesta
        const response = {
            "total": publicaciones.count,
            "pagina": pagina,
            "limite": limite,
            "total_paginas": totalPaginas,
            "pagina_siguiente": pagina < totalPaginas ? {
                "url": `/publicaciones?pagina=${pagina + 1}&limite=${limite}`,
                "exists": true
            } : {
                "url": null,
                "exists": false
            },
            "pagina_anterior": pagina > 1 ? {
                "url": `/publicaciones?pagina=${pagina - 1}&limite=${limite}`,
                "exists": true
            } : {
                "url": null,
                "exists": false
            },
            "publicaciones": publicaciones.rows // Ya no necesitamos mapear porque los datos vienen planos
        };

        return response;
    } catch (error) {
        throw new Error('Error al obtener todas las publicaciones: ' + error.message);
    }
};

/**
 * Función para actualizar completamente una publicación (PUT).
 * @param {number} id_publicacion - ID de la publicación a actualizar.
 * @param {Object} datosPublicacion - Nuevos datos completos de la publicación.
 * @returns {Promise<Object|null>} La publicación actualizada o null si no existe.
 */
const actualizarPublicacionCompletaService = async (id_publicacion, datosPublicacion) => {
    try {
        const publicacion = await Publicacion.findByPk(id_publicacion);

        if (!publicacion) {
            console.log('Publicación no encontrada');
            return null;
        }

        const {descripcion, imagen, id_usuario} = datosPublicacion;

        // Verificamos si todos los campos necesarios están presentes
        if (descripcion === undefined || imagen === undefined || id_usuario === undefined) {
            throw new Error('Todos los campos son requeridos para una actualización completa');
        }

        // Actualizamos la publicación usando el modelo Sequelize
        const [numFilasActualizadas] = await Publicacion.update({
            descripcion,
            imagen,
            id_usuario,
            fecha: Sequelize.literal('NOW()')
        }, {
            where: {id_publicacion}
        });

        if (numFilasActualizadas === 0) {
            console.log('No se pudo actualizar la publicación');
            return null;
        }

        // Retornamos la publicación actualizada
        return await Publicacion.findByPk(id_publicacion);

    } catch (error) {
        console.error('Error al actualizar la publicación:', error);
        throw error;
    }
};


/**
 * Función para actualizar parcialmente una publicación (PATCH).
 * @param {number} id_publicacion - ID de la publicación a actualizar.
 * @param {Object} datosPublicacion - Datos parciales de la publicación a actualizar.
 * @returns {Promise<Object|null>} La publicación actualizada o null si no existe.
 */

const actualizarPublicacionParcialService = async (id_publicacion, datosPublicacion) => {
    try {
        const publicacion = await Publicacion.findByPk(id_publicacion);

        if (!publicacion) {
            console.log('Publicación no encontrada');
            return null;
        }

        console.log(datosPublicacion);
        console.log(id_publicacion);
        const {descripcion, imagen} = datosPublicacion;

        // Modificamos esta parte para permitir actualizaciones parciales
        let camposActualizar = {};
        if (descripcion) camposActualizar.descripcion = descripcion;
        if (imagen) camposActualizar.imagen = imagen;

        if (Object.keys(camposActualizar).length === 0) {
            throw new Error('Se requiere al menos un campo para actualizar');
        }

        camposActualizar.fecha = Sequelize.literal('NOW()');

        const [numFilasActualizadas] = await Publicacion.update(camposActualizar, {
            where: {id_publicacion}
        });

        if (numFilasActualizadas === 0) {
            console.log('No se pudo actualizar la publicación');
            return null;
        }

        return await Publicacion.findByPk(id_publicacion);

    } catch (error) {
        console.error('Error al actualizar la publicación:', error);
        throw error;
    }
};

const eliminarPublicacionService = async (id_publicacion) => {
    try {
        const publicacion = await Publicacion.findByPk(id_publicacion);

        if (!publicacion) {
            console.log('Publicación no encontrada');
            return null;
        }

        await publicacion.destroy();

        console.log('Publicación eliminada exitosamente');
        return publicacion;


    } catch (error) {
        console.error('Error al eliminar la publicación:', error);
        throw error;
    }
};


const obtenerTotalPublicaciones = async () => {
    try {
        const totalPublicaciones = await Publicacion.count();
        return totalPublicaciones;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener la cantidad de publicaciones');
    }
};

const obtenerPublicacionesPorMes = async () => {
    try {
        const publicacionesPorMes = await Publicacion.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('fecha')), 'mes'],
                [Sequelize.fn('COUNT', Sequelize.col('id_publicacion')), 'total']
            ],
            group: ['mes']
        });

        return publicacionesPorMes;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener la cantidad de publicaciones por mes');
    }
}

const obtenerPromedioPublicacionesDiarias = async () => {
    try {
        const totalPublicaciones = await Publicacion.count();
        const diasUnicos = await Publicacion.findAll({
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('fecha')), 'dia_unico']
            ],
            group: ['dia_unico']
        });

        const promedio = totalPublicaciones / diasUnicos.length;
        return promedio;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener el promedio de publicaciones diarias');
    }
}

// Exporta las funciones para que puedan ser utilizadas en otros módulos
module.exports = {
    crearPublicacionService,
    obtenerPublicacionesPorUsuarioService,
    obtenerPublicacionPorIdService,
    obtenerTodasLasPublicacionesService,
    actualizarPublicacionCompletaService,
    actualizarPublicacionParcialService,
    eliminarPublicacionService,
    obtenerTotalPublicaciones,
    obtenerPublicacionesPorMes,
    obtenerPromedioPublicacionesDiarias

};
