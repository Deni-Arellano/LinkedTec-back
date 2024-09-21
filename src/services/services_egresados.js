const Egresado = require('../models/egresados');

// Servicio para crear un nuevo egresado
exports.crearEgresado = async (data) => {
    try {
        const nuevoEgresado = await Egresado.create(data);
        return { success: true, data: nuevoEgresado };
    } catch (error) {
        return { success: false, error: 'Error al crear el egresado' };
    }
};

// Servicio para obtener un egresado por ID
exports.obtenerEgresadoPorId = async (id) => {
    try {
        const egresado = await Egresado.findByPk(id);

        if (!egresado) {
            return { success: false, error: 'Egresado no encontrado' };
        }

        return { success: true, data: egresado };
    } catch (error) {
        return { success: false, error: 'Error al obtener el egresado' };
    }
};
